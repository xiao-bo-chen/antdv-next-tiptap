import { inject } from 'vue'

import type { LocaleKey } from '@/locales'

import { localeKey, zhCN } from '@/locales'

/**
 * 在子组件中获取翻译函数 t() 和 key 存在检测函数 has()
 * 如果祖先组件未 provide locale，则回退到中文默认值
 */
export function useLocale() {
    const messages = inject(localeKey, zhCN as Record<LocaleKey, string>)

    const t = (key: LocaleKey): string => messages[key]

    /** 判断一个字符串是否是有效的 locale key */
    const has = (key: string): key is LocaleKey => key in messages

    return { t, has }
}
