import { useEffect } from "react";
import type { Editor } from "@tiptap/core";

import {
  defaultBackgroundColor,
  defaultFontColor,
  defaultFontFamily,
  defaultFontSize,
  defaultStyle,
} from "../defaults";

type SelectionStateHandlers = {
  setStyle: (value: string) => void;
  setFontSize: (value: string) => void;
  setFontFamily: (value: string) => void;
  setFontColor: (value: string) => void;
  setBackgroundColor: (value: string) => void;
};

const headingLevels: Array<1 | 2 | 3> = [1, 2, 3];

const withFallback = (value: unknown, fallback: string) =>
  typeof value === "string" && value.length > 0 ? value : fallback;

function useMenuSync(
  editor: Editor | null,
  {
    setStyle,
    setFontSize,
    setFontFamily,
    setFontColor,
    setBackgroundColor,
  }: SelectionStateHandlers,
) {
  useEffect(() => {
    if (!editor) {
      return;
    }

    const syncSelectState = () => {
      const headingLevel = headingLevels.find((level) => editor.isActive("heading", { level }));

      setStyle(headingLevel ? `h${headingLevel}` : defaultStyle);

      const textStyleAttributes = editor.getAttributes("textStyle");
      setFontFamily(withFallback(textStyleAttributes["fontFamily"], defaultFontFamily));
      setFontSize(withFallback(textStyleAttributes["fontSize"], defaultFontSize));
      setFontColor(withFallback(textStyleAttributes["color"], defaultFontColor));

      const highlightAttributes = editor.getAttributes("highlight");
      setBackgroundColor(withFallback(highlightAttributes?.["color"], defaultBackgroundColor));
    };

    syncSelectState();
    editor.on("selectionUpdate", syncSelectState);

    return () => {
      editor.off("selectionUpdate", syncSelectState);
    };
  }, [editor, setStyle, setFontSize, setFontFamily, setFontColor, setBackgroundColor]);
}

export { useMenuSync };
