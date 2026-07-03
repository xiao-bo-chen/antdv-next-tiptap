<script lang="ts" setup>
import { reactive, watch } from 'vue'

import { useLocale } from '@/composables/useLocale'

export interface ImageFormData {
    src: string
    alt: string
    width: number | null
    height: number | null
}

const props = defineProps<{
    title: string
    initialValues?: Partial<ImageFormData>
}>()

const open = defineModel<boolean>('open', { required: true })
const emit = defineEmits<{ confirm: [data: ImageFormData] }>()

const { t } = useLocale()

const form = reactive<ImageFormData>({ src: '', alt: '', width: null, height: null })

watch(open, (val) => {
    if (!val) return
    form.src = props.initialValues?.src ?? ''
    form.alt = props.initialValues?.alt ?? ''
    form.width = props.initialValues?.width ?? null
    form.height = props.initialValues?.height ?? null
})

const handleConfirm = () => {
    if (!form.src.trim()) return
    emit('confirm', {
        src: form.src.trim(),
        alt: form.alt.trim(),
        width: form.width,
        height: form.height
    })
    open.value = false
}
</script>

<template>
    <a-modal
        v-model:open="open"
        :title="title"
        width="480px"
        :z-index="9999"
        :focus-after-show="false"
    >
        <a-form layout="vertical" class="form">
            <a-form-item :label="t('imageUrl')">
                <a-input
                    v-model:value="form.src"
                    placeholder="https://..."
                    allow-clear
                    @press-enter="handleConfirm"
                />
            </a-form-item>
            <a-form-item :label="t('imageAlt')">
                <a-input
                    v-model:value="form.alt"
                    :placeholder="t('imageAltPlaceholder')"
                    allow-clear
                />
            </a-form-item>
            <div class="form__row">
                <a-form-item :label="t('width')" class="flex-1">
                    <a-input-number
                        v-model:value="form.width"
                        :placeholder="t('widthPlaceholder')"
                        :min="20"
                        style="width: 100%"
                    />
                </a-form-item>
                <a-form-item :label="t('height')" class="flex-1">
                    <a-input-number
                        v-model:value="form.height"
                        :placeholder="t('heightPlaceholder')"
                        :min="20"
                        style="width: 100%"
                    />
                </a-form-item>
            </div>
        </a-form>
        <template #footer>
            <a-button @click="open = false">{{ t('cancel') }}</a-button>
            <a-button type="primary" @click="handleConfirm">{{ t('confirm') }}</a-button>
        </template>
    </a-modal>
</template>

<style lang="scss" scoped>
.form {
    @apply pt-16px;

    &__row {
        @apply flex gap-16px;
    }
}
</style>
