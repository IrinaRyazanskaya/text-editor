import cn from "classnames";
import * as React from "react";
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
  defaultTextDirection,
} from "./defaults";
import { clearMathFormula, getStyleFontSize } from "./extensions";
import { useHeadingReset } from "./hooks";
import { FontFamilySelect, FontSizeSelect, StyleSelect } from "./selects";
import type { Variant } from "./types";

type MenuProps = Omit<React.HTMLAttributes<HTMLDivElement>, "ref"> & {
  variant?: Variant;
  disabled?: boolean;
};

const Menu: React.FC<MenuProps> = ({ variant = "simple", disabled, ...props }) => {
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

  const handleStyleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
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

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const color = event.target.value;
    setFontColor(color);
    editor.chain().focus().setColor(color).run();
  };

  const handleBackgroundColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    editor.commands.setTextDirection(defaultTextDirection);
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
          disabled={disabled}
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
              disabled={disabled}
              onChange={(e) => {
                const size = e.target.value;
                setFontSize(size);
                editor.chain().focus().setFontSize(size).run();
              }}
            />

            <StyleSelect value={style} disabled={disabled} onChange={handleStyleChange} />
          </>
        )}
      </div>

      <BoldButton disabled={disabled} />
      <ItalicButton disabled={disabled} />
      <UnderlineButton disabled={disabled} />
      <StrikeButton disabled={disabled} />

      {variant === "full" && (
        <>
          <FontColorButton value={fontColor} disabled={disabled} onChange={handleColorChange} />
          <BackgroundColorButton
            value={backgroundColor}
            disabled={disabled}
            onChange={handleBackgroundColorChange}
          />
        </>
      )}

      <OrderedListButton disabled={disabled} />
      <BulletListButton disabled={disabled} />

      {variant === "full" && (
        <>
          <DecreaseIndentButton disabled={disabled} />
          <IncreaseIndentButton disabled={disabled} />
          <SuperscriptButton disabled={disabled} />
          <SubscriptButton disabled={disabled} />
          <CodeButton disabled={disabled} />
          <BlockquoteButton disabled={disabled} />
        </>
      )}

      <TextAlignButton disabled={disabled} />
      <LinkButton disabled={disabled} />
      <ImageButton disabled={disabled} />
      <VideoButton disabled={disabled} />

      {variant === "full" && (
        <MathButton
          disabled={disabled}
          fontColor={fontColor}
          fontSize={fontSize}
          fontFamily={fontFamily}
        />
      )}

      <ClearButton disabled={disabled} onReset={resetAllStyles} />
    </div>
  );
};

Menu.displayName = "Menu";

export { Menu };
export type { MenuProps };
