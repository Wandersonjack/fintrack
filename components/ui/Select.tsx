import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "../../lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  options,
  onChange,
  placeholder = "Select an option",
  className,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("w-full space-y-2", className)} ref={containerRef}>
      {label && (
        <label className="text-sm font-medium leading-none text-zinc-700">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex h-11 w-full items-center justify-between rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 ring-offset-white transition-all focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            isOpen && "ring-2 ring-brand-400 border-brand-400",
            error && "border-red-500",
            !selectedOption && "text-zinc-500"
          )}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-zinc-400 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </button>

        {isOpen && (
          <div className="absolute z-[100] mt-2 w-full min-w-[8rem] overflow-hidden rounded-xl border border-zinc-200 bg-white p-1 text-zinc-950 shadow-xl animate-in fade-in zoom-in-95 duration-100 origin-top">
            <div className="max-h-[300px] overflow-y-auto overflow-x-hidden">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={cn(
                    "relative flex w-full cursor-default select-none items-center rounded-lg py-2 pl-3 pr-9 text-sm outline-none transition-colors hover:bg-zinc-100 focus:bg-zinc-100",
                    value === option.value && "bg-brand-50 text-brand-900 font-semibold hover:bg-brand-100"
                  )}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  <span className="block truncate">{option.label}</span>
                  {value === option.value && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-brand-600">
                      <Check className="h-4 w-4" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
