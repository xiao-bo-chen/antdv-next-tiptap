/**
 * 文本对齐功能扩展
 * 支持左对齐、居中对齐、右对齐和两端对齐
 */
import TextAlign from '@tiptap/extension-text-align'

import AlignCenterIcon from '@/assets/icons/ri--align-center.svg'
import AlignJustifyIcon from '@/assets/icons/ri--align-justify.svg'
import AlignLeftIcon from '@/assets/icons/ri--align-left.svg'
import AlignRightIcon from '@/assets/icons/ri--align-right.svg'

import type { EditorPlugin } from './types'

export const textAlignPlugin: EditorPlugin = {
    name: 'textAlign',
    extensions: [TextAlign.configure({ types: ['heading', 'paragraph'] })],
    toolbar: [
        { divider: true },
        {
            icon: AlignLeftIcon,
            title: 'alignLeft',
            action: (editor) => editor.chain().focus().setTextAlign('left').run(),
            isActive: (editor) => editor.isActive({ textAlign: 'left' })
        },
        {
            icon: AlignCenterIcon,
            title: 'alignCenter',
            action: (editor) => editor.chain().focus().setTextAlign('center').run(),
            isActive: (editor) => editor.isActive({ textAlign: 'center' })
        },
        {
            icon: AlignRightIcon,
            title: 'alignRight',
            action: (editor) => editor.chain().focus().setTextAlign('right').run(),
            isActive: (editor) => editor.isActive({ textAlign: 'right' })
        },
        {
            icon: AlignJustifyIcon,
            title: 'alignJustify',
            action: (editor) => editor.chain().focus().setTextAlign('justify').run(),
            isActive: (editor) => editor.isActive({ textAlign: 'justify' })
        }
    ]
}
