<script setup lang="ts">
/**
 * 视频上传 NodeView 组件
 * 当用户在编辑器中点击视频按钮时，会插入一个上传区域
 * 用户可以通过拖拽或点击选择视频文件进行上传
 * 上传完成后，该节点会被替换为真实的视频节点
 */
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import { inject, ref } from 'vue'

import DeleteBinLine from '@/assets/icons/ri--delete-bin-line.svg'
import VideoLineIcon from '@/assets/icons/ri--video-line.svg'
import { useLocale } from '@/composables/useLocale'

import { uploadVideoKey } from '../injectionKeys'

const props = defineProps(nodeViewProps)

const { t } = useLocale()

// 注入上传函数，如果没有配置则使用 FileReader 转 Base64
const uploadVideo = inject(uploadVideoKey, undefined)

// 上传状态
const uploading = ref(false)
const progress = ref(0)

// 支持的视频格式
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']
const ALLOWED_VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.avi', '.mkv']

/**
 * 视频格式校验
 * 在上传前检查文件类型和扩展名
 */
const beforeUpload = (file: File) => {
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type)
    const ext = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
    const isExtAllowed = ALLOWED_VIDEO_EXTENSIONS.includes(ext)

    if (!isVideo && !isExtAllowed) {
        return false
    }
    return true
}

/**
 * 将上传节点替换为真实的视频节点
 * @param src - 视频地址
 */
const replaceWithVideo = (src: string) => {
    if (!props.editor) return
    const videoType = props.editor.state.schema.nodes['nativeVideo']
    if (!videoType) return
    const state = props.editor.state
    const serialize = (doc: typeof state.doc) => JSON.stringify(doc.toJSON())
    const before = serialize(state.doc)
    // 不信任节点视图的 getPos/node：v-model 回灌触发 setContent 重建文档后，
    // 节点视图可能整体失效（getPos 失效、props.node 被清理，访问即抛错）。
    // 直接在当前文档里定位上传占位节点，位置与尺寸都从文档拿（多个占位时取第一个）。
    let found: { pos: number; size: number } | null = null
    state.doc.descendants((node, nodePos) => {
        if (found == null && node.type === state.schema.nodes['videoUpload']) {
            found = { pos: nodePos, size: node.nodeSize }
            return false
        }
        return true
    })
    if (found == null) {
        props.editor.commands.insertContent(videoType.create({ src }))
        return
    }
    const buildTr = (node: ReturnType<typeof videoType.create>) =>
        state.tr.replaceWith(found!.pos, found!.pos + found!.size, node)
    const tr = buildTr(videoType.create({ src }))
    // inline 视频可能放不进 block 占位（如占位是文档唯一内容），prosemirror 会静默放弃；
    // 对比替换前后的文档，未生效时用段落包裹重试，再不行兜底 insertContent。
    if (serialize(tr.doc) !== before) {
        props.editor.view.dispatch(tr)
        return
    }
    const paragraphType = state.schema.nodes['paragraph']
    if (paragraphType) {
        const tr2 = buildTr(paragraphType.create(null, videoType.create({ src })))
        if (serialize(tr2.doc) !== before) {
            props.editor.view.dispatch(tr2)
            return
        }
    }
    props.editor.commands.insertContent(videoType.create({ src }))
}

/**
 * 自定义上传处理函数
 * 供 a-upload-dragger 的 custom-request 使用
 */
const handleCustomUpload = ({ file, onProgress, onSuccess, onError }: any) => {
    const f = file as File
    uploading.value = true
    progress.value = 0

    const finish = () => {
        uploading.value = false
    }

    // 如果配置了自定义上传函数则使用，否则使用 Base64
    if (uploadVideo) {
        uploadVideo(f, (pct) => {
            progress.value = pct
            onProgress({ percent: pct })
        })
            .then((src) => {
                onSuccess(src)
                replaceWithVideo(src)
            })
            .catch((err) => {
                onError(err)
                finish()
            })
    } else {
        // 使用 FileReader 读取为 Base64
        const reader = new FileReader()
        reader.onload = (ev) => {
            const src = ev.target!.result as string
            onSuccess(src)
            replaceWithVideo(src)
            finish()
        }
        reader.onerror = () => {
            onError(reader.error)
            finish()
        }
        reader.readAsDataURL(f)
    }
}
</script>

<template>
    <NodeViewWrapper class="video-upload-node" contenteditable="false">
        <div class="upload-wrapper">
            <a-upload-dragger
                :show-upload-list="false"
                accept="video/*"
                :custom-request="handleCustomUpload"
                :before-upload="beforeUpload"
                :disabled="uploading"
                :multiple="false"
            >
                <div class="upload-inner">
                    <div class="upload-icon-wrap">
                        <VideoLineIcon class="file-icon" />
                    </div>
                    <p class="upload-title">{{ t('videoUploadTitle') }}</p>
                    <p v-if="uploading" class="upload-hint">
                        <a-progress :percent="progress" size="small" />
                    </p>
                    <p v-else class="upload-hint">{{ t('videoUploadHint') }}</p>
                </div>
            </a-upload-dragger>
            <!-- 删除按钮 -->
            <div class="upload-toolbar">
                <div class="toolbar-btn" @click.stop="deleteNode()">
                    <DeleteBinLine />
                </div>
            </div>
        </div>
    </NodeViewWrapper>
</template>

<style lang="scss" scoped>
.video-upload-node {
    @apply my-8px;

    :deep(.ant-upload.ant-upload-drag) {
        @apply rounded-8px;
    }
}

.upload-wrapper {
    @apply relative;
}

.upload-toolbar {
    @apply absolute top-0 right-0 flex;
    transform: translate(30%, -30%);

    .toolbar-btn {
        @apply w-24px h-24px flex-center rounded-full bg-container shadow-md cursor-pointer;

        svg {
            @apply w-14px h-14px text-text-secondary hover:c-red;
        }
    }
}

.upload-inner {
    @apply py-24px flex flex-col items-center gap-8px;
}

.upload-icon-wrap {
    @apply w-48px h-48px rounded-full bg-primary flex-center;

    svg {
        @apply w-24px h-24px text-white fill-white;
    }
}

.upload-title {
    @apply m-0 text-14px text-text;
}

.upload-hint {
    @apply m-0 text-12px text-text-secondary min-w-200px;
}
</style>
