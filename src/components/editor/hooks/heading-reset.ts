import { useEffect, useRef } from "react";
import { Editor } from "@tiptap/core";

function useHeadingReset(editor: Editor | null, onResetCallback: () => void) {
  const wasHeading = useRef(false);

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      const isHeadingNow = [1, 2, 3].some((level) => editor.isActive("heading", { level }));

      if (wasHeading.current && !isHeadingNow) {
        onResetCallback();
        editor.commands.resetAttributes("paragraph", ["style", "class"]);
      }

      wasHeading.current = isHeadingNow;
    };

    editor.on("selectionUpdate", handleUpdate);

    return () => {
      editor.off("selectionUpdate", handleUpdate);
    };
  }, [editor, onResetCallback]);
}

export { useHeadingReset };
