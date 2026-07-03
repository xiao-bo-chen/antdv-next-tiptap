<script lang="ts" setup>
import type { Editor } from '@tiptap/vue-3'
import type { Color, ColorValueType } from 'antdv-next'

import { computed, ref, shallowRef, watch } from 'vue'

import { useLocale } from '@/composables/useLocale'

type PickerColor = Extract<ColorValueType, string | { cleared: any }>

const props = defineProps<{
    editor?: Editor
    /** 图标 */
    icon: any
    /** 标题 */
    title: string
    /** 应用颜色的回调 */
    apply: (color: string) => void
    /** 获取当前颜色 */
    getColor?: () => string
}>()

const { t, has } = useLocale()

/** title 支持 locale key 或直接文字 */
const resolvedTitle = computed(() => (has(props.title) ? t(props.title as any) : props.title))

const PRESET_COLORS = computed(() => [
    {
        label: t('presetColors'),
        colors: [
            '#91caff',
            '#69b1ff',
            '#4096ff',
            '#1677ff',
            '#0958d9',
            '#ff7875',
            '#ffbb96',
            '#ffc069',
            '#ffe58f',
            '#d3f261',
            '#95de64',
            '#5cdbd3'
        ]
    }
])

const open = ref(false)
const color = shallowRef<PickerColor>(props.getColor?.() ?? '#000000')

const displayColor = computed(() => {
    if (typeof color.value === 'string') return color.value
    return (color.value as any)?.toHexString?.() ?? '#000000'
})

watch(
    () => props.getColor?.(),
    (newColor) => {
        if (newColor !== undefined) color.value = newColor as PickerColor
    },
    { immediate: true }
)

const currColor = ref('')

const handleColorChange = (val: Color) => {
    currColor.value = val.toHexString()
}

const handleClear = () => {
    props.apply('')
    open.value = false
}

const handleConfirm = () => {
    open.value = false
    props.apply(currColor.value || color.value.toString())
}
</script>

<template>
    <a-color-picker
        v-model:value="color"
        v-model:open="open"
        :presets="PRESET_COLORS"
        :arrow="false"
        format="hex"
        @change="handleColorChange"
    >
        <template #panelRender="{ panel }">
            <component :is="panel" />
            <div class="color-footer">
                <a-button size="small" @click="handleClear">{{ t('colorClear') }}</a-button>
                <a-button size="small" type="primary" @click="handleConfirm">{{
                    t('confirm')
                }}</a-button>
            </div>
        </template>
        <a-tooltip :title="resolvedTitle">
            <div class="toolbar-btn">
                <div class="flex flex-col items-center gap-1px">
                    <component :is="icon"></component>
                    <span class="color-swatch" :style="{ background: displayColor }" />
                </div>
            </div>
        </a-tooltip>
    </a-color-picker>
</template>

<style lang="scss" scoped>
.toolbar-btn {
    @apply cursor-pointer w-32px h-32px flex-center rounded-6px transition-base flex-shrink-0;
    @apply hover:bg-ant-primary-bg hover:c-ant-primary;
}

.color-swatch {
    @apply w-14px h-2px rounded-full block;
}

.color-footer {
    @apply gap-8px flex justify-end items-center px-8px py-6px;
}
</style>
