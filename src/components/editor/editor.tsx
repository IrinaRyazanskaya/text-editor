import cn from "classnames";
import * as React from "react";
import { useMemo } from "react";
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

type EditorProps = Omit<React.HTMLAttributes<HTMLDivElement>, "ref"> & {
  variant?: "simple" | "full";
  disabled?: boolean;
  showError?: boolean;
  placeholder?: string;
  onContentChange: (content: EditorContent) => void;
};

const quoteStyles = cn(
  "prose-blockquote:pl-4",
  "prose-blockquote:border-l-4",
  "prose-blockquote:border-gray-400",
  "prose-blockquote:italic",
  "prose-blockquote:text-gray-600",
);

const codeStyles = cn(
  "prose-code:font-mono",
  "prose-code:bg-gray-200",
  "prose-code:rounded",
  "prose-code:px-1",
  "prose-code:py-0.5",
  "prose-code:text-gray-800",
  "prose-p:my-0",
);

const Editor = React.forwardRef<HTMLDivElement, EditorProps>(
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
        data-testid="Editor"
        className={cn(
          "border",
          "border-gray",
          "rounded-lg",
          "overflow-hidden",
          "w-full",
          disabled && "border-gray-100 pointer-events-none",
          showError && "border-red-500",
        )}
        {...props}
      >
        <EditorProvider
          slotBefore={<Menu variant={variant} disabled={disabled} />}
          extensions={extensions}
          editorContainerProps={{
            className: cn(
              "prose",
              "prose-compact",
              "p-4",
              "w-full",
              "max-w-none",
              "min-h-[138px]",
              "bg-gray-100",
              "prose-p:my-0",
              "text-gray-800",
              "overflow-auto",
              "outline-none",
              "[&_div]:outline-none",
              "[&_div]:focus:outline-none",
              codeStyles,
              quoteStyles,
              disabled && "bg-gray-100 opacity-40 pointer-events-none",
              showError && "bg-red-50",
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
