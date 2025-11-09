import cn from "classnames";
import { type FC, type ButtonHTMLAttributes, type ChangeEvent } from "react";
import { useCurrentEditor } from "@tiptap/react";

import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  BulletListIcon,
  ClearIcon,
  Code,
  DecreaseIndent,
  FontColor,
  ImageIcon,
  IncreaseIndent,
  ItalicIcon,
  LinkIcon,
  Math,
  OrderedListIcon,
  Quote,
  Shading,
  StrikeIcon,
  Subscript,
  Superscript,
  UnderlineIcon,
  VideoIcon,
} from "./icons";
import { toggleMathFormula } from "./extensions";
import { useReactiveEditor } from "./hooks";
import type { TextAlignment } from "./types";

import "./buttons.css";

type BaseMenuButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  disabled?: boolean;
  className?: string;
};

const BaseMenuButton: FC<BaseMenuButtonProps> = ({
  active,
  disabled,
  children,
  className,
  ...props
}: BaseMenuButtonProps) => {
  const buttonStyles = cn(
    className,
    "editor-button",
    active && "editor-button_active",
    disabled && "editor-button_disabled",
  );

  return (
    <button className={buttonStyles} disabled={disabled === true} {...props}>
      {children}
    </button>
  );
};

BaseMenuButton.displayName = "BaseMenuButton";

type BoldButtonProps = {
  disabled?: boolean;
};

const BoldButton: FC<BoldButtonProps> = ({ disabled }) => {
  const editor = useReactiveEditor();

  if (!editor) {
    return null;
  }

  return (
    <BaseMenuButton
      disabled={disabled === true}
      active={editor.isActive("bold")}
      onClick={() => editor.chain().focus().toggleBold().run()}
    >
      <BoldIcon />
    </BaseMenuButton>
  );
};

BoldButton.displayName = "BoldButton";

type ItalicButtonProps = {
  disabled?: boolean;
};

const ItalicButton: FC<ItalicButtonProps> = ({ disabled }) => {
  const editor = useReactiveEditor();

  if (!editor) {
    return null;
  }

  return (
    <BaseMenuButton
      disabled={disabled === true}
      active={editor.isActive("italic")}
      onClick={() => editor.chain().focus().toggleItalic().run()}
    >
      <ItalicIcon />
    </BaseMenuButton>
  );
};

ItalicButton.displayName = "ItalicButton";

type UnderlineButtonProps = {
  disabled?: boolean;
};

const UnderlineButton: FC<UnderlineButtonProps> = ({ disabled }) => {
  const editor = useReactiveEditor();

  if (!editor) {
    return null;
  }

  return (
    <BaseMenuButton
      disabled={disabled === true}
      active={editor.isActive("underline")}
      onClick={() => void editor.chain().focus().toggleUnderline().run()}
    >
      <UnderlineIcon />
    </BaseMenuButton>
  );
};

UnderlineButton.displayName = "UnderlineButton";

type StrikeButtonProps = {
  disabled?: boolean;
};

const StrikeButton: FC<StrikeButtonProps> = ({ disabled }) => {
  const editor = useReactiveEditor();

  if (!editor) {
    return null;
  }

  return (
    <BaseMenuButton
      disabled={disabled === true}
      active={editor.isActive("strike")}
      onClick={() => editor.chain().focus().toggleStrike().run()}
    >
      <StrikeIcon />
    </BaseMenuButton>
  );
};

StrikeButton.displayName = "StrikeButton";

type FontColorButtonProps = {
  value: string;
  disabled?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const FontColorButton: FC<FontColorButtonProps> = ({ value, disabled, onChange }) => {
  const editor = useReactiveEditor();

  if (!editor) {
    return null;
  }

  return (
    <BaseMenuButton
      type="button"
      title="Font Color"
      active={editor.isActive("textStyle", { color: value })}
      disabled={disabled === true}
      className="editor-button_type_font-color"
    >
      <FontColor />
      <input type="color" value={value} onChange={onChange} className="editor-button__input" />
    </BaseMenuButton>
  );
};

FontColorButton.displayName = "FontColorButton";

type BackgroundColorButtonProps = {
  value: string;
  disabled?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const BackgroundColorButton: FC<BackgroundColorButtonProps> = ({ value, disabled, onChange }) => {
  const editor = useReactiveEditor();

  if (!editor) {
    return null;
  }

  return (
    <BaseMenuButton
      type="button"
      title="Background Color"
      active={editor.isActive("highlight")}
      disabled={disabled === true}
      className="editor-button_type_background-color"
    >
      <Shading />
      <input type="color" value={value} onChange={onChange} className="editor-button__input" />
    </BaseMenuButton>
  );
};

BackgroundColorButton.displayName = "BackgroundColorButton";

type OrderedListButtonProps = {
  disabled?: boolean;
};

const OrderedListButton: FC<OrderedListButtonProps> = ({ disabled }) => {
  const editor = useReactiveEditor();

  if (!editor) {
    return null;
  }

  return (
    <BaseMenuButton
      disabled={disabled === true}
      active={editor.isActive("orderedList")}
      onClick={() => editor.chain().focus().toggleOrderedList().run()}
    >
      <OrderedListIcon />
    </BaseMenuButton>
  );
};

OrderedListButton.displayName = "OrderedListButton";

type BulletListButtonProps = {
  disabled?: boolean;
};

const BulletListButton: FC<BulletListButtonProps> = ({ disabled }) => {
  const editor = useReactiveEditor();

  if (!editor) {
    return null;
  }

  return (
    <BaseMenuButton
      disabled={disabled === true}
      active={editor.isActive("bulletList")}
      onClick={() => editor.chain().focus().toggleBulletList().run()}
    >
      <BulletListIcon />
    </BaseMenuButton>
  );
};

BulletListButton.displayName = "BulletListButton";

type DecreaseIndentButtonProps = {
  disabled?: boolean;
};

const DecreaseIndentButton: FC<DecreaseIndentButtonProps> = ({ disabled }) => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <BaseMenuButton
      title="Decrease indent"
      disabled={disabled === true}
      onClick={() => editor.chain().focus().outdent().run()}
    >
      <DecreaseIndent />
    </BaseMenuButton>
  );
};

DecreaseIndentButton.displayName = "DecreaseIndentButton";

type IncreaseIndentButtonProps = {
  disabled?: boolean;
};

const IncreaseIndentButton: FC<IncreaseIndentButtonProps> = ({ disabled }) => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <BaseMenuButton
      title="Increase indent"
      disabled={disabled === true}
      onClick={() => editor.chain().focus().indent().run()}
    >
      <IncreaseIndent />
    </BaseMenuButton>
  );
};

IncreaseIndentButton.displayName = "IncreaseIndentButton";

type SuperscriptButtonProps = {
  disabled?: boolean;
};

const SuperscriptButton: FC<SuperscriptButtonProps> = ({ disabled }) => {
  const editor = useReactiveEditor();

  if (!editor) {
    return null;
  }

  return (
    <BaseMenuButton
      disabled={disabled === true}
      active={editor.isActive("superscript")}
      onClick={() => editor.chain().focus().toggleSuperscript().run()}
    >
      <Superscript />
    </BaseMenuButton>
  );
};

SuperscriptButton.displayName = "SuperscriptButton";

type SubscriptButtonProps = {
  disabled?: boolean;
};

const SubscriptButton: FC<SubscriptButtonProps> = ({ disabled }) => {
  const editor = useReactiveEditor();

  if (!editor) {
    return null;
  }

  return (
    <BaseMenuButton
      disabled={disabled === true}
      active={editor.isActive("subscript")}
      onClick={() => editor.chain().focus().toggleSubscript().run()}
    >
      <Subscript />
    </BaseMenuButton>
  );
};

SubscriptButton.displayName = "SubscriptButton";

type CodeButtonProps = {
  disabled?: boolean;
};

const CodeButton: FC<CodeButtonProps> = ({ disabled }) => {
  const editor = useReactiveEditor();

  if (!editor) {
    return null;
  }

  return (
    <BaseMenuButton
      disabled={disabled === true}
      active={editor.isActive("code")}
      onClick={() => editor.chain().focus().toggleCode().run()}
    >
      <Code />
    </BaseMenuButton>
  );
};

CodeButton.displayName = "CodeButton";

type BlockquoteButtonProps = {
  disabled?: boolean;
};

const BlockquoteButton: FC<BlockquoteButtonProps> = ({ disabled }) => {
  const editor = useReactiveEditor();

  if (!editor) {
    return null;
  }

  return (
    <BaseMenuButton
      disabled={disabled === true}
      active={editor.isActive("blockquote")}
      onClick={() => editor.chain().focus().toggleBlockquote().run()}
    >
      <Quote />
    </BaseMenuButton>
  );
};

BlockquoteButton.displayName = "BlockquoteButton";

type TextAlignButtonProps = {
  disabled?: boolean;
};

const TextAlignButton: FC<TextAlignButtonProps> = ({ disabled }) => {
  const editor = useReactiveEditor();

  if (!editor) {
    return null;
  }

  const alignments: TextAlignment[] = ["center", "right", "left"];

  const currentAlignment = alignments.find((align) => {
    return editor.isActive({ textAlign: align });
  });
  const currentIndex = alignments.indexOf(currentAlignment ?? "left");
  const nextAlignment = alignments[(currentIndex + 1) % alignments.length];

  const handleClick = () => {
    editor
      .chain()
      .focus()
      .setTextAlign(nextAlignment ?? "left")
      .run();
  };

  const getIcon = (align: TextAlignment) => {
    switch (align) {
      case "left":
        return <AlignLeftIcon />;
      case "center":
        return <AlignCenterIcon />;
      case "right":
        return <AlignRightIcon />;
      default:
        return <AlignLeftIcon />;
    }
  };

  return (
    <BaseMenuButton
      disabled={disabled === true}
      onClick={handleClick}
      active={Boolean(currentAlignment) && editor.isActive({ textAlign: currentAlignment })}
    >
      {getIcon(currentAlignment ?? "left")}
    </BaseMenuButton>
  );
};

TextAlignButton.displayName = "TextAlignButton";

type LinkButtonProps = {
  disabled?: boolean;
};

const LinkButton: FC<LinkButtonProps> = ({ disabled }) => {
  const editor = useReactiveEditor();

  if (!editor) {
    return null;
  }

  const handleClick = () => {
    const url = window.prompt("Enter URL");
    if (url) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  };

  return (
    <BaseMenuButton
      onClick={handleClick}
      active={editor.isActive("link")}
      disabled={disabled === true}
    >
      <LinkIcon />
    </BaseMenuButton>
  );
};

LinkButton.displayName = "LinkButton";

type ImageButtonProps = {
  disabled?: boolean;
};

const ImageButton: FC<ImageButtonProps> = ({ disabled }) => {
  const editor = useReactiveEditor();

  if (!editor) {
    return null;
  }

  const handleClick = () => {
    const url = window.prompt("Enter image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <BaseMenuButton
      onClick={handleClick}
      active={editor.isActive("image")}
      disabled={disabled === true}
    >
      <ImageIcon />
    </BaseMenuButton>
  );
};

ImageButton.displayName = "ImageButton";

type VideoButtonProps = {
  disabled?: boolean;
};

const VideoButton: FC<VideoButtonProps> = ({ disabled }) => {
  const editor = useReactiveEditor();

  if (!editor) {
    return null;
  }

  const handleClick = () => {
    const url = window.prompt("Enter video URL");
    if (url) {
      editor.chain().focus().setVideo(url).run();
    }
  };

  return (
    <BaseMenuButton
      onClick={handleClick}
      active={editor.isActive("video")}
      disabled={disabled === true}
    >
      <VideoIcon />
    </BaseMenuButton>
  );
};

VideoButton.displayName = "VideoButton";

type MathButtonProps = {
  disabled?: boolean;
  fontColor: string;
  fontSize: string;
  fontFamily: string;
};

const MathButton: FC<MathButtonProps> = ({ disabled, fontColor, fontSize, fontFamily }) => {
  const editor = useReactiveEditor();

  if (!editor) {
    return null;
  }

  const handleClick = () => {
    toggleMathFormula(editor, {
      color: fontColor,
      fontSize: fontSize,
      fontFamily: fontFamily,
    });
  };

  return (
    <BaseMenuButton
      title="Math"
      disabled={disabled === true}
      onClick={handleClick}
      active={editor.isActive("math_inline")}
    >
      <Math />
    </BaseMenuButton>
  );
};

MathButton.displayName = "MathButton";

type ClearButtonProps = {
  disabled?: boolean;
  onReset: () => void;
};

const ClearButton: FC<ClearButtonProps> = ({ disabled, onReset }) => {
  return (
    <BaseMenuButton disabled={disabled === true} onClick={onReset}>
      <ClearIcon />
    </BaseMenuButton>
  );
};

ClearButton.displayName = "ClearButton";

export {
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
};
