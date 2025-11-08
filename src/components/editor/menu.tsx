import cn from "classnames";
import { type FC, type HTMLAttributes, type ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { useCurrentEditor } from "@tiptap/react";

import {
  BackgroundColorButton,
  BlockquoteButton,
  BoldButton,
  BulletListButton,
  ClearButton,
  CodeButton,
  DecreaseIndentButton,
  FontColorButton,
  ImageButton,
  IncreaseIndentButton,
  ItalicButton,
  LinkButton,
  MathButton,
  OrderedListButton,
  StrikeButton,
  SubscriptButton,
  SuperscriptButton,
  TextAlignButton,
  UnderlineButton,
  VideoButton,
} from "./buttons";
import {
  defaultBackgroundColor,
  defaultFontColor,
  defaultFontFamily,
  defaultFontSize,
  defaultStyle,
  defaultTextAlign,
} from "./defaults";
import { clearMathFormula, getStyleFontSize } from "./extensions";
import { useHeadingReset } from "./hooks";
import { FontFamilySelect, FontSizeSelect, StyleSelect } from "./selects";
import type { Variant } from "./types";

type MenuProps = Omit<HTMLAttributes<HTMLDivElement>, "ref"> & {
  variant?: Variant;
  disabled?: boolean;
};

const Menu: FC<MenuProps> = ({ variant = "simple", disabled, ...props }) => {
  const { editor } = useCurrentEditor();

  const [style, setStyle] = useState(defaultStyle);
  const [fontSize, setFontSize] = useState(defaultFontSize);
  const [fontColor, setFontColor] = useState(defaultFontColor);
  const [fontFamily, setFontFamily] = useState(defaultFontFamily);
  const [backgroundColor, setBackgroundColor] = useState(defaultBackgroundColor);

  useEffect(() => {
    if (!editor) {
      return;
    }

    setStyle(defaultStyle);
    editor.commands.setParagraph();
    editor.commands.setFontSize(defaultFontSize);
    editor.commands.setFontFamily(defaultFontFamily);
  }, [editor]);

  useHeadingReset(editor, () => {
    setStyle(defaultStyle);
    setFontSize(defaultFontSize);
  });

  if (!editor) {
    return null;
  }

  const handleStyleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const style = event.target.value;
    const fontSize = getStyleFontSize(style);

    if (style === "normal") {
      editor.chain().focus().setParagraph().unsetBold().setFontSize(fontSize).run();
    } else {
      const level = Number(style.replace("h", "")) as 1 | 2 | 3;
      editor.chain().focus().toggleHeading({ level }).setFontSize(fontSize).setBold().run();
    }

    setStyle(style);
    setFontSize(fontSize);
  };

  const handleColorChange = (event: ChangeEvent<HTMLInputElement>) => {
    const color = event.target.value;
    setFontColor(color);
    editor.chain().focus().setColor(color).run();
  };

  const handleBackgroundColorChange = (event: ChangeEvent<HTMLInputElement>) => {
    const color = event.target.value;
    setBackgroundColor(color);
    editor.chain().focus().setHighlight({ color }).run();
  };

  const resetAllStyles = () => {
    editor.chain().focus().unsetAllMarks().clearNodes().run();
    editor.commands.setFontFamily(defaultFontFamily);
    editor.commands.setFontSize(defaultFontSize);
    editor.commands.setColor(defaultFontColor);
    editor.commands.unsetHighlight();
    editor.commands.unsetLink();
    editor.commands.setTextAlign(defaultTextAlign);
    clearMathFormula(editor, {
      color: defaultFontColor,
      fontSize: defaultFontSize,
      fontFamily: defaultFontFamily,
    });
    setFontFamily(defaultFontFamily);
    setFontSize(defaultFontSize);
    setFontColor(defaultFontColor);
    setBackgroundColor(defaultBackgroundColor);
    setStyle(defaultStyle);
  };

  return (
    <div
      className={cn(
        "flex",
        "flex-wrap",
        "gap-2",
        "px-4",
        "py-1",
        "bg-white",
        "border-b",
        "border-gray",
        disabled && "border-gray-100",
      )}
      {...props}
    >
      <div className="flex gap-4">
        <FontFamilySelect
          value={fontFamily}
          disabled={disabled === true}
          onChange={(e) => {
            const font = e.target.value;
            setFontFamily(font);
            editor.chain().focus().setFontFamily(font).run();
          }}
        />
        {variant === "full" && (
          <>
            <FontSizeSelect
              value={fontSize}
              disabled={disabled === true}
              onChange={(e) => {
                const size = e.target.value;
                setFontSize(size);
                editor.chain().focus().setFontSize(size).run();
              }}
            />

            <StyleSelect value={style} disabled={disabled === true} onChange={handleStyleChange} />
          </>
        )}
      </div>

      <BoldButton disabled={disabled === true} />
      <ItalicButton disabled={disabled === true} />
      <UnderlineButton disabled={disabled === true} />
      <StrikeButton disabled={disabled === true} />

      {variant === "full" && (
        <>
          <FontColorButton
            value={fontColor}
            disabled={disabled === true}
            onChange={handleColorChange}
          />
          <BackgroundColorButton
            value={backgroundColor}
            disabled={disabled === true}
            onChange={handleBackgroundColorChange}
          />
        </>
      )}

      <OrderedListButton disabled={disabled === true} />
      <BulletListButton disabled={disabled === true} />

      {variant === "full" && (
        <>
          <DecreaseIndentButton disabled={disabled === true} />
          <IncreaseIndentButton disabled={disabled === true} />
          <SuperscriptButton disabled={disabled === true} />
          <SubscriptButton disabled={disabled === true} />
          <CodeButton disabled={disabled === true} />
          <BlockquoteButton disabled={disabled === true} />
        </>
      )}

      <TextAlignButton disabled={disabled === true} />
      <LinkButton disabled={disabled === true} />
      <ImageButton disabled={disabled === true} />
      <VideoButton disabled={disabled === true} />

      {variant === "full" && (
        <MathButton
          disabled={disabled === true}
          fontColor={fontColor}
          fontSize={fontSize}
          fontFamily={fontFamily}
        />
      )}

      <ClearButton disabled={disabled === true} onReset={resetAllStyles} />
    </div>
  );
};

Menu.displayName = "Menu";

export { Menu };
export type { MenuProps };
