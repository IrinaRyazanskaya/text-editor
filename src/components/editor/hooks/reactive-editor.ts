import { useSyncExternalStore } from "react";
import { useCurrentEditor } from "@tiptap/react";
import type { Editor } from "@tiptap/core";

const editorEvents: Array<Parameters<Editor["on"]>[0]> = [
  "selectionUpdate",
  "transaction",
  "update",
  "focus",
  "blur",
];

type EditorStore = {
  getSnapshot: () => number;
  subscribe: (listener: () => void) => () => void;
};

const editorStores = new WeakMap<Editor, EditorStore>();

const getEditorStore = (editor: Editor): EditorStore => {
  let store = editorStores.get(editor);

  if (store) {
    return store;
  }

  let version = 0;
  const listeners = new Set<() => void>();

  const handleUpdate = () => {
    version += 1;
    listeners.forEach((listener) => listener());
  };

  editorEvents.forEach((event) => editor.on(event, handleUpdate));

  const subscribe = (listener: () => void) => {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);

      if (listeners.size === 0) {
        editorEvents.forEach((event) => editor.off(event, handleUpdate));
        editorStores.delete(editor);
      }
    };
  };

  const getSnapshot = () => version;

  store = {
    getSnapshot,
    subscribe,
  };

  editorStores.set(editor, store);

  return store;
};

function useReactiveEditor() {
  const { editor } = useCurrentEditor();

  useSyncExternalStore(
    (listener) => {
      if (!editor) {
        return () => undefined;
      }

      return getEditorStore(editor).subscribe(listener);
    },
    () => (editor ? getEditorStore(editor).getSnapshot() : 0),
    () => 0,
  );

  return editor;
}

export { useReactiveEditor };
