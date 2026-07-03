<script lang="ts" setup>
import type { Editor } from '@tiptap/vue-3'

import { useLocale } from '@/composables/useLocale'

const props = defineProps<{ editor?: Editor }>()

const { t } = useLocale()

/** 可用字体选项 - 包含中英文常见字体 */
const FONT_OPTIONS = computed(() => [
    { label: t('fontMicrosoftYaHei'), value: 'Microsoft YaHei' },
    { label: t('fontSimSun'), value: 'SimSun' },
    { label: t('fontSimHei'), value: 'SimHei' },
    { label: 'Arial', value: 'Arial' },
    { label: 'Georgia', value: 'Georgia' },
    { label: 'Courier New', value: 'Courier New' },
    { label: 'Verdana', value: 'Verdana' }
])

const currentFont = computed(() =>
    props.editor
        ? ((props.editor.getAttributes('textStyle').fontFamily as string | undefined) ?? undefined)
        : undefined
)

const applyFont = (value: string | undefined) => {
    if (!props.editor) return
    if (!value) {
        props.editor.chain().focus().unsetFontFamily().run()
    } else {
        props.editor.chain().focus().setFontFamily(value).run()
    }
}
</script>

<template>
    <a-select
        size="small"
        :value="currentFont"
        :options="FONT_OPTIONS"
        :placeholder="t('fontFamilyPlaceholder')"
        style="width: 104px"
        allow-clear
        @change="applyFont"
    />
</template>
