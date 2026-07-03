import { UndoRedo } from '@tiptap/extensions'

import ArrowGoBackLineIcon from '@/assets/icons/ri--arrow-go-back-line.svg'
import ArrowGoForwardLineIcon from '@/assets/icons/ri--arrow-go-forward-line.svg'

import type { EditorPlugin } from './types'

/**
 * 撤销重做功能扩展
 * 提供撤销和重做操作功能
 */
export const undoRedoPlugin: EditorPlugin = {
    name: 'undoRedo',
    extensions: [UndoRedo],
    toolbar: [
        { divider: true },
        {
            icon: ArrowGoBackLineIcon,
            title: 'undo',
            action: (editor) => editor.chain().focus().undo().run()
        },
        {
            icon: ArrowGoForwardLineIcon,
            title: 'redo',
            action: (editor) => editor.chain().focus().redo().run()
        }
    ]
}
