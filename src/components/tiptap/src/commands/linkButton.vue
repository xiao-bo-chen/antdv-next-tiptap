<script lang="ts" setup>
import type { Editor } from '@tiptap/vue-3'
import type { FormInstance, InputRef } from 'antdv-next'
import type { Rule } from 'antdv-next/dist/form/types'

import { computed, nextTick, reactive, ref } from 'vue'

import LinkIcon from '@/assets/icons/ri--link.svg'
import { useLocale } from '@/composables/useLocale'

const props = defineProps<{ editor?: Editor }>()

const { t } = useLocale()

const visible = ref(false)
const formRef = ref<FormInstance>()
const hrefInputRef = ref<InputRef>()
const formData = reactive({ href: '', openInNewTab: false })

const rules = computed<Record<string, Rule[]>>(() => ({
    href: [{ required: true, message: t('linkUrlRequired'), trigger: ['blur', 'change'] }]
}))

const isActive = computed(() => !!props.editor?.isActive('link'))

const openModal = () => {
    if (!props.editor) return
    const attrs = props.editor.getAttributes('link')
    formData.href = (attrs.href as string) ?? ''
    formData.openInNewTab = attrs.target === '_blank'
    visible.value = true
}

const handleConfirm = async () => {
    if (!props.editor) return
    await formRef.value?.validate()
    props.editor
        .chain()
        .focus()
        .setLink({ href: formData.href.trim(), target: formData.openInNewTab ? '_blank' : null })
        .setUnderline()
        .setColor('var(--ant-color-primary)')
        .run()
    handleCancel()
}

const handleRemoveLink = () => {
    if (!props.editor) return
    props.editor.chain().focus().unsetLink().run()
    visible.value = false
}

const handleCancel = () => {
    formRef.value?.resetFields()
    visible.value = false
}
</script>

<template>
    <div :title="t('link')" :class="['toolbar-btn', { active: isActive }]" @click="openModal">
        <a-tooltip :title="t('link')" placement="bottom">
            <LinkIcon></LinkIcon>
        </a-tooltip>
    </div>
    <a-modal
        v-model:open="visible"
        :title="t('insertLink')"
        width="420px"
        :closable="false"
        @cancel="handleCancel"
    >
        <a-form ref="formRef" :model="formData" :rules="rules" layout="vertical" class="link-form">
            <a-form-item :label="t('linkUrl')" name="href">
                <a-input
                    ref="hrefInputRef"
                    v-model:value="formData.href"
                    placeholder="https://..."
                    allow-clear
                />
            </a-form-item>
            <a-form-item name="openInNewTab">
                <a-checkbox v-model:checked="formData.openInNewTab">{{
                    t('openInNewTab')
                }}</a-checkbox>
            </a-form-item>
            <a-form-item v-if="isActive">
                <a-button danger @click="handleRemoveLink">{{ t('removeLink') }}</a-button>
            </a-form-item>
        </a-form>
        <template #footer>
            <a-button @click="handleCancel">{{ t('cancel') }}</a-button>
            <a-button type="primary" @click="handleConfirm">{{ t('confirm') }}</a-button>
        </template>
    </a-modal>
</template>

<style lang="scss" scoped>
.toolbar-btn {
    @apply cursor-pointer w-32px h-32px flex-center rounded-6px transition-base flex-shrink-0;
    @apply hover:bg-ant-primary-bg hover:c-ant-primary;

    &.active {
        @apply bg-ant-primary-bg text-primary-text;
    }
}

.link-form {
    @apply pt-16px;
}
</style>
