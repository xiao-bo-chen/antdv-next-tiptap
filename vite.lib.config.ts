import { AntdvNextResolver } from '@antdv-next/auto-import-resolver'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import svgLoader from 'vite-svg-loader'

/**
 * 将 dts 默认输出路径转换为期望的 dist 结构。
 *   dist/types/src/components/...        -> dist/types/...
 *   dist/types/src/locales/...            -> dist/types/locales/...
 *   dist/types/src/composables/...        -> dist/types/composables/...
 * 用 positive lookahead 处理末尾可能没有 / 的情况（path.posix.resolve 的结果常常如此）。
 */
function transformPath(p: string): string {
    return p
        .replace(/[/\\]src[/\\]components(?=[/\\]|$)/g, '')
        .replace(/[/\\]src[/\\]locales(?=[/\\]|$)/g, '/locales')
        .replace(/[/\\]src[/\\]composables(?=[/\\]|$)/g, '/composables')
}

/**
 * dts 内容里的相对 import/export 路径是按"原文件位置"算的，文件被 beforeWriteFile 改名后
 * 这些相对路径就指错了。这里按"旧位置 -> 新位置"重新算一次。
 */
function fixRelativeImports(content: string, oldFilePath: string, newFilePath: string): string {
    const oldDir = path.posix.dirname(oldFilePath)
    const newDir = path.posix.dirname(newFilePath)
    const importExportRe =
        /((?:^|\n)\s*(?:import|export)\s+(?:type\s+)?(?:[\s\S]+?from\s+)?)(['"])(\.[^'"]*)\2/gm

    return content.replace(
        importExportRe,
        (match, prefix: string, quote: string, importPath: string) => {
            const oldAbsoluteTarget = path.posix.resolve(oldDir, importPath)
            const newAbsoluteTarget = transformPath(oldAbsoluteTarget)
            let newRelativePath = path.posix.relative(newDir, newAbsoluteTarget)
            if (!newRelativePath.startsWith('.')) {
                newRelativePath = './' + newRelativePath
            }
            return prefix + quote + newRelativePath + quote
        }
    )
}

export default defineConfig({
    plugins: [
        vue(),
        vueJsx(),
        unocss(),
        svgLoader(),
        Components({
            resolvers: [AntdvNextResolver()],
            extensions: ['vue'],
            dirs: [],
            dts: false
        }),
        AutoImport({
            dts: false,
            dirs: [],
            imports: ['vue']
        }),
        dts({
            include: [
                'typings/*.d.ts',
                'src/components/**/*',
                'src/locales/**/*',
                'src/composables/**/*'
            ],
            outDirs: 'dist/types',
            tsconfigPath: './tsconfig.lib.json',
            strictOutput: false,
            beforeWriteFile: (filePath, content) => {
                const newFilePath = transformPath(filePath)
                return {
                    filePath: newFilePath,
                    content: fixRelativeImports(content, filePath, newFilePath)
                }
            }
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    build: {
        outDir: 'dist',
        lib: {
            entry: fileURLToPath(new URL('./src/components/index.ts', import.meta.url)),
            formats: ['es'],
            fileName: () => 'index.mjs'
        },
        rollupOptions: {
            checks: {
                pluginTimings: false
            },
            external: ['vue', 'antdv-next', /^@tiptap\//],
            output: {
                assetFileNames: 'index.[ext]'
            }
        },
        cssCodeSplit: false,
        sourcemap: true
    }
})
