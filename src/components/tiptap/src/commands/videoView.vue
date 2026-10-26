<script lang="ts" setup>
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import { computed, inject, ref } from 'vue'

import AlignCenterIcon from '@/assets/icons/ri--align-center.svg'
import AlignJustifyIcon from '@/assets/icons/ri--align-justify.svg'
import AlignLeftIcon from '@/assets/icons/ri--align-left.svg'
import AlignRightIcon from '@/assets/icons/ri--align-right.svg'
import DeleteBinLine from '@/assets/icons/ri--delete-bin-line.svg'
import PencilLineIcon from '@/assets/icons/ri--pencil-line.svg'
import { useLocale } from '@/composables/useLocale'

import type { VideoFormData } from './videoModal.vue'

import { editableKey } from '../injectionKeys'
import VideoModal from './videoModal.vue'

const props = defineProps(nodeViewProps)

const { t } = useLocale()
const editable = inject(editableKey)
const modalOpen = ref(false)

const initialValues = computed<Partial<VideoFormData>>(() => ({
    src: props.node.attrs.src ?? '',
    width: props.node.attrs.width ?? null,
    height: props.node.attrs.height ?? null,
    controls: props.node.attrs.controls ?? true,
    autoplay: props.node.attrs.autoplay ?? false,
    muted: props.node.attrs.muted ?? false,
    loop: props.node.attrs.loop ?? false
}))

const displayModes = computed(() => [
    { key: 'block', icon: AlignJustifyIcon, label: t('imageDisplayBlock') },
    { key: 'inline', icon: AlignCenterIcon, label: t('imageDisplayInline') },
    { key: 'left', icon: AlignLeftIcon, label: t('imageDisplayFloatLeft') },
    { key: 'right', icon: AlignRightIcon, label: t('imageDisplayFloatRight') }
])

const viewClass = computed(() => {
    const display = props.node.attrs.display ?? 'inline'
    return ['video-view', `video-view--${display}`]
})

// 弹层挂到节点容器内：编辑器全屏时挂 body 的弹层会被全屏元素盖住
const popupContainer = (trigger: HTMLElement) =>
    (trigger.closest('.video-view') as HTMLElement | null) ?? document.body

// 纯数字补 px，百分比/带单位字符串直接用
const toSize = (val: string | null) => {
    if (!val) return undefined
    return /^\d+$/.test(val.trim()) ? `${val}px` : val
}

const videoStyle = computed(() => {
    const w = toSize(props.node.attrs.width)
    const h = toSize(props.node.attrs.height)
    if (!w && !h) return { width: '100%', display: 'block' }
    if (w && h) return { width: w, height: h, display: 'block' }
    return {
        ...(w ? { width: w, maxWidth: '100%' } : {}),
        ...(h ? { height: h } : {}),
        display: 'block'
    }
})

const handleConfirm = (data: VideoFormData) => {
    props.updateAttributes({
        src: data.src,
        width: data.width || null,
        height: data.height || null,
        controls: data.controls,
        autoplay: data.autoplay,
        muted: data.muted,
        loop: data.loop
    })
}
</script>

<template>
    <NodeViewWrapper :class="viewClass">
        <a-popover
            trigger="hover"
            :arrow="false"
            placement="top"
            :get-popup-container="popupContainer"
        >
            <template v-if="editable" #content>
                <div class="video-toolbar">
                    <template v-for="mode in displayModes" :key="mode.key">
                        <a-tooltip
                            :title="mode.label"
                            placement="top"
                            :get-popup-container="popupContainer"
                        >
                            <div
                                class="video-toolbar__btn"
                                :class="{
                                    'video-toolbar__btn--active':
                                        (node.attrs.display ?? 'inline') === mode.key
                                }"
                                @click.stop="updateAttributes({ display: mode.key })"
                            >
                                <component :is="mode.icon" />
                            </div>
                        </a-tooltip>
                    </template>
                    <div class="video-toolbar__divider" />
                    <a-tooltip
                        :title="t('edit')"
                        placement="top"
                        :get-popup-container="popupContainer"
                    >
                        <div class="video-toolbar__btn" @click.stop="modalOpen = true">
                            <PencilLineIcon></PencilLineIcon>
                        </div>
                    </a-tooltip>
                    <div class="video-toolbar__divider" />
                    <a-tooltip
                        :title="t('delete')"
                        placement="top"
                        :get-popup-container="popupContainer"
                    >
                        <div
                            class="video-toolbar__btn video-toolbar__btn--danger"
                            @click.stop="deleteNode()"
                        >
                            <DeleteBinLine></DeleteBinLine>
                        </div>
                    </a-tooltip>
                </div>
            </template>

            <div class="video-view__body" :class="{ selected }">
                <video
                    :src="node.attrs.src"
                    :style="videoStyle"
                    :controls="node.attrs.controls"
                    :autoplay="node.attrs.autoplay"
                    :muted="node.attrs.muted"
                    :loop="node.attrs.loop"
                />
            </div>
        </a-popover>

        <VideoModal
            v-model:open="modalOpen"
            :title="t('editVideo')"
            :initial-values="initialValues"
            @confirm="handleConfirm"
        />
    </NodeViewWrapper>
</template>

<style lang="scss">
.video-view {
    @apply relative block my-8px;

    &--inline {
        @apply inline-block my-4px;
    }

    &--block {
        @apply block my-8px;
        text-align: center;
    }

    &--left {
        float: left;
        @apply inline-block my-4px mr-8px;
    }

    &--right {
        float: right;
        @apply inline-block my-4px ml-8px;
    }

    &__body {
        @apply inline-block cursor-pointer box-border rounded-4px;
        outline: none;

        video {
            @apply block rounded-4px max-w-100%;
        }
    }
}

.video-toolbar {
    @apply flex items-center gap-2px;

    &__btn {
        @apply cursor-pointer w-32px h-32px flex-center rounded-6px transition-base flex-shrink-0;
        @apply text-text hover:bg-ant-primary-bg hover:text-primary;

        &--active {
            @apply bg-ant-primary-bg text-primary;
        }

        &--danger {
            @apply hover:bg-ant-error-bg hover:text-error;
        }
    }

    &__divider {
        @apply w-1px h-16px bg-ant-border-secondary mx-2px flex-shrink-0;
    }
}
</style>
