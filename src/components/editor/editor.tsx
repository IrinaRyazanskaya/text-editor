import cn from "classnames";
import { type HTMLAttributes, useMemo, forwardRef } from "react";
import { EditorProvider } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { FontFamily } from "@tiptap/extension-font-family";
import { Underline } from "@tiptap/extension-underline";
import { Link } from "@tiptap/extension-link";
import { Image } from "@tiptap/extension-image";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { Superscript } from "@tiptap/extension-superscript";
import { Subscript } from "@tiptap/extension-subscript";

import type { EditorContent } from "./content";
import { FontSize, MathInline, Video, Indent } from "./extensions";
import { Menu } from "./menu";

import "katex/dist/katex.min.css";
import "./editor.css";

type EditorProps = Omit<HTMLAttributes<HTMLDivElement>, "ref"> & {
  variant?: "simple" | "full";
  disabled?: boolean;
  showError?: boolean;
  placeholder?: string;
  onContentChange: (content: EditorContent) => void;
};

const Editor = forwardRef<HTMLDivElement, EditorProps>(
  ({ variant = "simple", disabled, showError, placeholder, onContentChange, ...props }, ref) => {
    const extensions = useMemo(
      () => [
        StarterKit.configure({
          bulletList: {
            keepMarks: true,
            keepAttributes: false,
          },
          orderedList: {
            keepMarks: true,
            keepAttributes: false,
          },
          heading: {
            levels: [1, 2, 3],
          },
        }),
        TextStyle,
        FontFamily.configure({
          types: ["textStyle"],
        }),
        Underline,
        TextAlign.configure({
          types: ["heading", "paragraph"],
          alignments: ["left", "center", "right"],
        }),
        Link.configure({
          autolink: true,
          linkOnPaste: true,
        }),
        Image,
        Video,
        FontSize,
        Color.configure({
          types: ["textStyle"],
        }),
        Highlight.configure({
          multicolor: true,
        }),
        Placeholder.configure({
          placeholder: placeholder || "Write something awesome...",
          showOnlyWhenEditable: true,
          showOnlyCurrent: false,
        }),
        Superscript,
        Subscript,
        MathInline,
        Indent.configure({
          types: ["paragraph", "heading"],
          minLevel: 0,
          maxLevel: 8,
        }),
      ],
      [placeholder],
    );

    return (
      <div
        ref={ref}
        className={cn("editor", disabled && "editor_disabled", showError && "editor_with-error")}
        {...props}
      >
        <EditorProvider
          slotBefore={<Menu variant={variant} disabled={disabled === true} />}
          extensions={extensions}
          editorContainerProps={{
            className: cn(
              "prose",
              "prose-compact",
              "editor__container",
              disabled && "editor__container_disabled",
              showError && "editor__container_with-error",
            ),
          }}
          onUpdate={({ editor }) => {
            onContentChange({
              getText: () => editor.getText(),
              getHTML: () => editor.getHTML(),
              getJSON: () => editor.getJSON(),
            });
          }}
        />
      </div>
    );
  },
);

Editor.displayName = "Editor";

export { Editor };
export type { EditorProps };
