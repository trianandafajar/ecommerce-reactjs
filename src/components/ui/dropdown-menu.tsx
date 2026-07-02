import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

type DropdownContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  rootRef: React.RefObject<HTMLDivElement | null>;
};

const DropdownMenuContext = React.createContext<DropdownContextValue | null>(null);

function useDropdownMenu() {
  const context = React.useContext(DropdownMenuContext);
  if (!context) {
    throw new Error("DropdownMenu components must be used within <DropdownMenu />");
  }
  return context;
}

function DropdownMenu({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!open) return;

    const onDocumentMouseDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onDocumentMouseDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onDocumentMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, rootRef }}>
      <div ref={rootRef} className={cn("relative inline-block", className)}>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

function DropdownMenuTrigger({
  asChild = false,
  children,
  className,
}: {
  asChild?: boolean;
  children: React.ReactElement;
  className?: string;
}) {
  const { open, setOpen } = useDropdownMenu();
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      type={asChild ? undefined : "button"}
      aria-expanded={open}
      onClick={() => setOpen(!open)}
      className={className}
    >
      {children}
    </Comp>
  );
}

function DropdownMenuContent({
  className,
  align = "end",
  children,
}: {
  className?: string;
  align?: "start" | "end";
  children: React.ReactNode;
}) {
  const { open } = useDropdownMenu();

  if (!open) return null;

  return (
    <div
      className={cn(
        "absolute top-full z-50 mt-2 min-w-56 rounded-2xl border border-slate-800 bg-slate-950 p-1 shadow-2xl shadow-black/40",
        align === "end" ? "right-0" : "left-0",
        className
      )}
    >
      {children}
    </div>
  );
}

function DropdownMenuLabel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("px-3 py-2 text-xs uppercase tracking-[0.3em] text-slate-500", className)}>
      {children}
    </div>
  );
}

function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div className={cn("my-1 h-px bg-slate-800", className)} />;
}

function DropdownMenuItem({
  className,
  children,
  onClick,
  disabled,
  asChild = false,
}: {
  className?: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler;
  disabled?: boolean;
  asChild?: boolean;
}) {
  const { setOpen } = useDropdownMenu();
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      type={asChild ? undefined : "button"}
      disabled={disabled}
      onClick={(event: any) => {
        onClick?.(event);
        setOpen(false);
      }}
      className={cn(
        "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none transition-colors hover:bg-slate-900 hover:text-white disabled:pointer-events-none disabled:opacity-50",
        className
      )}
    >
      {children}
    </Comp>
  );
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
};
