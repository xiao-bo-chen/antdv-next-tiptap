import type { InjectionKey } from 'vue'

import enUS from './en-US'
import zhCN from './zh-CN'

export { zhCN, enUS }

/** 所有翻译 key 的联合类型 */
export type LocaleKey = keyof typeof zhCN

/** 语言包类型：key 固定，值统一为 string */
export type LocaleMessages = Record<LocaleKey, string>

/** Vue provide/inject key */
export const localeKey: InjectionKey<LocaleMessages> = Symbol('tiptap-locale')
