"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image"

interface Props {
  value: string
  onChange: (html: string) => void
}

export default function TextEditor({
  value,
  onChange,
}: Props) {

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color.configure({
        types: ["textStyle"],
      }),
      Highlight,
      Underline,
      Link,
      Image,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) {
    return null
  }

  return (
    <>
      <div className="flex flex-wrap gap-2 border-b p-2">

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleBold().run()
          }
        >
          Bold
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleItalic().run()
          }
        >
          Italic
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleStrike().run()
          }
        >
          Strike
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleBulletList().run()
          }
        >
          Bullet List
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
        >
          Number List
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          H1
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleBlockquote().run()
          }
        >
          Quote
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleCodeBlock().run()
          }
        >
          Code
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().undo().run()
          }
        >
          Undo
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().redo().run()
          }
        >
          Redo
        </button>
        {/* Image  */}
        <button
          type="button"
          onClick={() => {
            const url = window.prompt("Image URL");

            if (url) {
              editor
                .chain()
                .focus()
                .setImage({ src: url })
                .run();
            }
          }}
        >
          Image
        </button>

      </div>

      <div className="border rounded-md">
        <EditorContent
          editor={editor}
          className="tiptap max-w-none min-h-[300px] p-4"
        />
      </div>
    </>
  )
}