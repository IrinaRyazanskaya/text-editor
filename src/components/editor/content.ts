import type { JSONContent } from "@tiptap/core";

type EditorContent = {
  getText(): string;
  getHTML(): string;
  getJSON(): JSONContent;
};

export type { EditorContent };
