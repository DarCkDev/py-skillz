import React from "react";

export interface SwitchProps {
  id?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

export function Switch({ id, checked = false, onCheckedChange, className = "" }: SwitchProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onCheckedChange) {
      onCheckedChange(e.target.checked);
    }
  };

  const containerClassName = `inline-flex h-5 w-9 cursor-pointer items-center rounded-full shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 ${checked ? 'bg-primary' : 'bg-input'} ${className}`;
  
  const thumbClassName = `block h-4 w-4 rounded-full bg-background shadow-lg transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`;

  return (
    <div className={containerClassName} onClick={() => onCheckedChange?.(!checked)} role="switch" aria-checked={checked}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={handleChange}
        className="sr-only"
      />
      <div className={thumbClassName} />
    </div>
  );
}
