<script setup lang="ts">
import { theme } from 'antdv-next'
import { computed, ref, watchEffect } from 'vue'

import './../dist/index.css'
// import { AEditor } from '@/components'
// @ts-ignore
import { AEditor } from './../dist'

const isDark = ref(false)
const locale = ref<'zh-CN' | 'en-US'>('zh-CN')

/** 预设主题色 */
const PRESET_COLORS = [
    { label: '拂晓蓝', color: '#1677ff' },
    { label: '薄暮红', color: '#f5222d' },
    { label: '火山橙', color: '#fa541c' },
    { label: '日暮橙', color: '#fa8c16' },
    { label: '金盏黄', color: '#faad14' },
    { label: '极光绿', color: '#52c41a' },
    { label: '明青', color: '#13c2c2' },
    { label: '酱紫', color: '#722ed1' },
    { label: '法式洋红', color: '#eb2f96' }
]

const primaryColor = ref(PRESET_COLORS[0]!.color)

const themeConfig = computed(() => ({
    algorithm: isDark.value ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: { colorPrimary: primaryColor.value }
}))

const value = ref(`<h2 style="text-align: center">Welcome To Antv Next Tiptap Editor Demo
</h2>
<p>🔥
  <strong>Antv Next Tiptap Editor </strong>🔥is a WYSIWYG rich-text editor using&nbsp;
  <a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/scrumpy/tiptap">tiptap</a>&nbsp;and
  <a target="_blank" rel="noopener noreferrer nofollow" href="https://www.antdv-next.cn/index-cn">antdv-next</a>&nbsp;for Vue3,
  <img src="https://i.ibb.co/nbRN3S2/undraw-upload-87y9.png" alt="" title="" width="200" height="200" data-display="right"> that's easy to use, friendly to developers, fully extensible and clean in design.
</p>
<p>
</p>
<p style="text-align: right">👉Click on the image to get started image features 👉
</p>
<p>
</p>
<p>You can switch to
  <strong>Code View </strong>💻 mode and toggle
  <strong>Fullscreen</strong> 📺 in this demo.
</p>
<p>
</p>
<p>
  <strong>Got questions or need help or feature request?</strong>
</p>
<p>🚀
  <strong>welcome to submit an </strong>
  <a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/pengyinghao/antdv-next-tiptap/issues"><strong>issue</strong></a> 😊
</p>
<p>I'm continuously working to add in new features.
</p>
<p>
</p>
<blockquote>
  <p>This demo is simple, switch tab for more features.
  </p>
  <p>All demos source code:
    <a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/pengyinghao/antdv-next-tiptap">source code 🔗</a>
  </p>
</blockquote>`)

watchEffect(() => {
    document.documentElement.classList.toggle('dark', isDark.value)
})

// demo 用的 mock，模拟上传进度，实际使用时替换为真实上传接口
const mockUpload = (file: File, onProgress: (p: number) => void): Promise<string> => {
    return new Promise((resolve) => {
        let p = 0
        const timer = setInterval(() => {
            p = Math.min(p + 10, 100)
            onProgress(p)
            if (p >= 100) {
                clearInterval(timer)
                resolve(URL.createObjectURL(file))
            }
        }, 200)
    })
}

const handleUploadImage = mockUpload
const handleUploadVideo = mockUpload
</script>

<template>
    <a-config-provider :theme="themeConfig">
        <a-app>
            <a
                href="https://github.com/datawhalechina/Hello-Agents"
                target="_blank"
                class="fixed top-0 right-0 z-1 decoration-none border-b-0"
            >
                <svg
                    viewBox="0 0 250 250"
                    width="80"
                    height="80"
                    fill="var(--ant-color-primary)"
                    aria-hidden="true"
                >
                    <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
                    <path
                        d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
                        fill="currentColor"
                        style="transform-origin: 130px 106px"
                        class="c-white"
                    ></path>
                    <path
                        d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
                        fill="currentColor"
                        class="c-white"
                    ></path>
                </svg>
            </a>
            <div class="h-100vh w-100vw flex-center bg-ant-layout transition-base">
                <div class="w-1000px flex flex-col gap-12px">
                    <!-- 工具栏 -->
                    <div class="flex items-center justify-between">
                        <!-- 语言切换 -->
                        <a-segmented
                            v-model:value="locale"
                            :options="[
                                { label: '中文', value: 'zh-CN' },
                                { label: 'English', value: 'en-US' }
                            ]"
                        />
                        <div class="flex items-center gap-16px">
                            <!-- 主题色切换 -->
                            <div class="flex items-center gap-6px">
                                <span
                                    v-for="item in PRESET_COLORS"
                                    :key="item.color"
                                    :title="item.label"
                                    class="color-swatch"
                                    :class="{ active: primaryColor === item.color }"
                                    :style="{ backgroundColor: item.color }"
                                    @click="primaryColor = item.color"
                                />
                            </div>
                            <!-- 明暗切换 -->
                            <a-switch
                                v-model:checked="isDark"
                                checked-children="🌙"
                                un-checked-children="☀️"
                            />
                        </div>
                    </div>

                    <a-editor
                        v-model="value"
                        :height="500"
                        :editable="true"
                        :word-count="1000"
                        :locale="locale"
                        :upload-image="handleUploadImage"
                        :upload-video="handleUploadVideo"
                    />
                </div>
            </div>
        </a-app>
    </a-config-provider>
</template>

<style scoped>
.color-swatch {
    display: inline-block;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid transparent;
    transition:
        transform 0.15s,
        border-color 0.15s;
}

.color-swatch:hover {
    transform: scale(1.2);
}

.color-swatch.active {
    transform: scale(1.2);
}
</style>
