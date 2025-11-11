import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'

export const useEditorSetup = (value, onChange) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3]
                },
                bulletList: {
                    keepMarks: true,
                    keepAttributes: true
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: true
                },
                listItem: {
                    keepMarks: true,
                    keepAttributes: true
                },
                paragraph: {
                    HTMLAttributes: {
                        class: 'tiptap-paragraph'
                    }
                }
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                autolink: true,
                linkOnPaste: true
            }),
            Image.configure({
                allowBase64: true,
                HTMLAttributes: {
                    class: 'tiptap-image'
                }
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph']
            })
        ],
        content: value || '<p></p>',
        onUpdate: ({ editor }) => {
            const html = editor.getHTML()
            if (onChange) {
                onChange({ target: { value: html } })
            }
        },
        editorProps: {
            attributes: {
                class: 'tiptap'
            }
        }
    })

    return editor
}

export const getCurrentParagraphStyle = (editor) => {
    if (editor.isActive('heading', { level: 1 })) return 'h1'
    if (editor.isActive('heading', { level: 2 })) return 'h2'
    if (editor.isActive('heading', { level: 3 })) return 'h3'
    return 'paragraph'
}

export const handleFormatChange = (editor, value) => {
    if (value === 'paragraph') {
        editor.chain().focus().setParagraph().run()
    } else if (value.startsWith('h')) {
        const level = parseInt(value.replace('h', ''))
        editor.chain().focus().setHeading({ level }).run()
    }
}

