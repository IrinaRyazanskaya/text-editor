import cn from "classnames";
import { type ReactNode, type ChangeEvent } from "react";

import { ArrowUpAndDownIcon } from "./icons";

import "./selects.css";

type BaseMenuSelectProps = {
  value: string;
  disabled?: boolean;
  ariaLabel: string;
  className?: string;
  children: ReactNode;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
};

const BaseMenuSelect = ({
  value,
  onChange,
  disabled,
  children,
  ariaLabel,
  className,
}: BaseMenuSelectProps) => (
  <div className="editor-select">
    <select
      value={value}
      disabled={disabled}
      onChange={onChange}
      aria-label={ariaLabel}
      className={cn(
        className,
        "editor-select__picker",
        disabled && "editor-select__picker_disabled",
      )}
    >
      {children}
    </select>
    <div className={cn("editor-select__icon", disabled && "editor-select__icon_disabled")}>
      <ArrowUpAndDownIcon />
    </div>
  </div>
);

BaseMenuSelect.displayName = "BaseMenuSelect";

const StyleSelect = ({
  value,
  onChange,
  disabled,
}: {
  value: string;
  disabled?: boolean;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}) => (
  <BaseMenuSelect
    value={value}
    onChange={onChange}
    ariaLabel="Font Style"
    disabled={disabled === true}
  >
    <option value="normal">Normal</option>
    <option value="h1">H1</option>
    <option value="h2">H2</option>
    <option value="h3">H3</option>
  </BaseMenuSelect>
);

StyleSelect.displayName = "StyleSelect";

const FontSizeSelect = ({
  value,
  onChange,
  disabled,
}: {
  value: string;
  disabled?: boolean;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}) => (
  <BaseMenuSelect
    value={value}
    onChange={onChange}
    ariaLabel="Font Size"
    disabled={disabled === true}
  >
    <option value="12px">12px</option>
    <option value="14px">14px</option>
    <option value="16px">16px</option>
    <option value="18px">18px</option>
    <option value="24px">24px</option>
    <option value="32px">32px</option>
  </BaseMenuSelect>
);

FontSizeSelect.displayName = "FontSizeSelect";

const FontFamilySelect = ({
  value,
  onChange,
  disabled,
}: {
  value: string;
  disabled?: boolean;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}) => (
  <BaseMenuSelect
    value={value}
    onChange={onChange}
    ariaLabel="Font Family"
    disabled={disabled === true}
  >
    <option value="Arial">Arial</option>
    <option value="Inter">Inter</option>
    <option value="Georgia">Georgia</option>
    <option value="Tahoma">Tahoma</option>
    <option value="Courier New">Courier New</option>
  </BaseMenuSelect>
);

FontFamilySelect.displayName = "FontFamilySelect";

export { StyleSelect, FontSizeSelect, FontFamilySelect };
