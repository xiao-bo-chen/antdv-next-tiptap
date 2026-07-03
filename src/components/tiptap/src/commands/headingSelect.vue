<script lang="ts" setup>
import type { Editor } from '@tiptap/vue-3'

import ArrowDownSLine from '@/assets/icons/ri--arrow-down-s-line.svg'
import H1Icon from '@/assets/icons/ri--h1.svg'
import H2Icon from '@/assets/icons/ri--h2.svg'
import H3Icon from '@/assets/icons/ri--h3.svg'
import { useLocale } from '@/composables/useLocale'

const props = defineProps<{ editor: Editor }>()

const { t } = useLocale()

const items = computed(() => [
    { level: 1 as const, icon: H1Icon, label: t('heading1') },
    { level: 2 as const, icon: H2Icon, label: t('heading2') },
    { level: 3 as const, icon: H3Icon, label: t('heading3') }
])

const activeLevel = computed(() => {
    for (const item of items.value) {
        if (props.editor.isActive('heading', { level: item.level })) return item.level
    }
    return null
})

const activeIcon = computed(
    () => items.value.find((i) => i.level === activeLevel.value)?.icon ?? H1Icon
)

const toggle = (level: 1 | 2 | 3) => {
    props.editor.chain().focus().toggleHeading({ level }).run()
}
</script>

<template>
    <a-dropdown :trigger="['hover']" placement="bottomLeft">
        <div :class="['toolbar-btn', { active: activeLevel !== null }]">
            <component :is="activeIcon"></component>
            <ArrowDownSLine class="ml-1px"></ArrowDownSLine>
        </div>
        <template #popupRender>
            <a-menu>
                <a-menu-item
                    v-for="item in items"
                    :key="`${item.level}`"
                    @click="toggle(item.level)"
                >
                    <div :class="['heading-item', { active: activeLevel === item.level }]">
                        <component :is="item.icon"></component>
                        <span>{{ item.label }}</span>
                    </div>
                </a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>
</template>

<style lang="scss" scoped>
.toolbar-btn {
    @apply ml-8px cursor-pointer h-32px px-6px flex-center rounded-6px transition-base flex-shrink-0 gap-2px;
    @apply text-text hover:bg-ant-primary-bg hover:text-primary;

    &.active {
        @apply bg-ant-primary-bg text-primary;
    }
}

.heading-item {
    @apply flex items-center gap-8px px-4px py-2px min-w-100px text-text;
    &.active {
        @apply text-primary;
    }
}
</style>
