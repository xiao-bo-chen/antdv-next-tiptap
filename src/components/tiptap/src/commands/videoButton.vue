<script lang="ts" setup>
import type { Editor } from '@tiptap/vue-3'

import { ref } from 'vue'

import VideoLineIcon from '@/assets/icons/ri--video-line.svg'
import { useLocale } from '@/composables/useLocale'

import VideoModal, { type VideoFormData } from './videoModal.vue'

const props = defineProps<{ editor?: Editor }>()

const { t } = useLocale()

const modalOpen = ref(false)

const insertUploadArea = () => {
    props.editor?.chain().focus().insertVideoUpload().run()
}

const handleConfirm = (data: VideoFormData) => {
    if (!props.editor) return
    props.editor
        .chain()
        .focus()
        .setNativeVideo({ ...data })
        .run()
}
</script>

<template>
    <a-dropdown :trigger="['click']" placement="bottomLeft">
        <div class="toolbar-btn">
            <VideoLineIcon />
        </div>
        <template #popupRender>
            <a-menu>
                <a-menu-item key="url" @click="modalOpen = true">{{
                    t('insertVideoUrl')
                }}</a-menu-item>
                <a-menu-item key="local" @click="insertUploadArea">{{
                    t('localUpload')
                }}</a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>

    <VideoModal v-model:open="modalOpen" :title="t('insertVideo')" @confirm="handleConfirm" />
</template>

<style lang="scss" scoped>
.toolbar-btn {
    @apply cursor-pointer w-32px h-32px flex-center rounded-6px transition-base flex-shrink-0;
    @apply hover:bg-ant-primary-bg hover:c-ant-primary;
}
</style>
