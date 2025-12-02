import React from 'react'
import { EditorContent } from '@tiptap/react'
import { cn } from '@/lib/utils'

const EditorArea = ({ editor, id, isDark }) => {
    return (
        <div
            className={cn(
                'flex-1 p-4 overflow-auto',
                isDark ? 'bg-[#252E38] text-white' : 'bg-white text-[#1c252e]'
            )}>
            <EditorContent
                editor={editor}
                id={id}
            />
        </div>
    )
}

export default EditorArea

