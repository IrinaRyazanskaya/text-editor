import cn from "classnames";
import * as React from "react";

import { ArrowUpAndDownIcon } from "../../../../icons";

const selectStyles = cn(
  "w-[76px]",
  "outline-none",
  "cursor-pointer",
  "appearance-none",
  "focus:outline-none",
);

const selectIconStyles = cn(
  "flex",
  "absolute",
  "right-0",
  "inset-y-0",
  "items-center",
  "pointer-events-none",
);

type BaseMenuSelectProps = {
  value: string;
  disabled?: boolean;
  ariaLabel: string;
  className?: string;
  children: React.ReactNode;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const BaseMenuSelect = ({
  value,
  onChange,
  disabled,
  children,
  ariaLabel,
  className,
}: BaseMenuSelectProps) => (
  <div className="relative">
    <select
      value={value}
      disabled={disabled}
      onChange={onChange}
      aria-label={ariaLabel}
      className={cn(selectStyles, disabled && "opacity-50", className)}
    >
      {children}
    </select>
    <div className={cn(selectIconStyles, disabled && "opacity-50")}>
      <ArrowUpAndDownIcon />
    </div>
  </div>
);

BaseMenuSelect.displayName = "BaseMenuSelect";

export const StyleSelect = ({
  value,
  onChange,
  disabled,
}: {
  value: string;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => (
  <BaseMenuSelect value={value} disabled={disabled} onChange={onChange} ariaLabel="Font Style">
    <option value="normal">Normal</option>
    <option value="h1">H1</option>
    <option value="h2">H2</option>
    <option value="h3">H3</option>
  </BaseMenuSelect>
);

StyleSelect.displayName = "StyleSelect";

export const FontSizeSelect = ({
  value,
  onChange,
  disabled,
}: {
  value: string;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => (
  <BaseMenuSelect value={value} disabled={disabled} onChange={onChange} ariaLabel="Font Size">
    <option value="12px">12px</option>
    <option value="14px">14px</option>
    <option value="16px">16px</option>
    <option value="18px">18px</option>
    <option value="24px">24px</option>
    <option value="32px">32px</option>
  </BaseMenuSelect>
);

FontSizeSelect.displayName = "FontSizeSelect";

export const FontFamilySelect = ({
  value,
  onChange,
  disabled,
}: {
  value: string;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => (
  <BaseMenuSelect value={value} disabled={disabled} onChange={onChange} ariaLabel="Font Family">
    <option value="Arial">Arial</option>
    <option value="Inter">Inter</option>
    <option value="Georgia">Georgia</option>
    <option value="Tahoma">Tahoma</option>
    <option value="Courier New">Courier New</option>
  </BaseMenuSelect>
);

FontFamilySelect.displayName = "FontFamilySelect";
