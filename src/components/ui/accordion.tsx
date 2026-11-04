"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionContextValue {
  expandedItems: Set<string>;
  toggleItem: (value: string) => void;
}

const AccordionContext = React.createContext<AccordionContextValue | undefined>(undefined);

export function Accordion({
  children,
  className,
  type = "single",
  defaultValue,
}: {
  children: React.ReactNode;
  className?: string;
  type?: "single" | "multiple";
  defaultValue?: string | string[];
}) {
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(() => {
    if (!defaultValue) return new Set();
    if (Array.isArray(defaultValue)) return new Set(defaultValue);
    return new Set([defaultValue]);
  });

  const toggleItem = React.useCallback(
    (value: string) => {
      setExpandedItems((prev) => {
        const next = new Set(prev);
        if (next.has(value)) {
          next.delete(value);
        } else {
          if (type === "single") {
            next.clear();
          }
          next.add(value);
        }
        return next;
      });
    },
    [type]
  );

  return (
    <AccordionContext.Provider value={{ expandedItems, toggleItem }}>
      <div className={cn("divide-y divide-border", className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div data-value={value} className={cn("border-b last:border-b-0", className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { itemValue: value } as any);
        }
        return child;
      })}
    </div>
  );
}

export function AccordionTrigger({
  children,
  className,
  itemValue,
}: {
  children: React.ReactNode;
  className?: string;
  itemValue?: string;
}) {
  const context = React.useContext(AccordionContext);
  if (!context || !itemValue) return null;

  const isOpen = context.expandedItems.has(itemValue);

  return (
    <button
      type="button"
      onClick={() => context.toggleItem(itemValue)}
      className={cn(
        "flex w-full items-center justify-between py-4 font-medium transition-all hover:underline text-left",
        className
      )}
      aria-expanded={isOpen}
    >
      {children}
      <ChevronDown
        className={cn(
          "h-4 w-4 shrink-0 transition-transform duration-200 text-muted-foreground",
          isOpen && "rotate-180"
        )}
      />
    </button>
  );
}

export function AccordionContent({
  children,
  className,
  itemValue,
}: {
  children: React.ReactNode;
  className?: string;
  itemValue?: string;
}) {
  const context = React.useContext(AccordionContext);
  if (!context || !itemValue) return null;

  const isOpen = context.expandedItems.has(itemValue);
  if (!isOpen) return null;

  return (
    <div className={cn("pb-4 pt-0 text-sm text-muted-foreground", className)}>
      {children}
    </div>
  );
}

