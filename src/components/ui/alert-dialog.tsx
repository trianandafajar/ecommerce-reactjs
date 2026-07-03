import * as React from "react";
import { createPortal } from "react-dom";
import { Slot } from "@radix-ui/react-slot";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

type AlertDialogContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const AlertDialogContext = React.createContext<AlertDialogContextValue | null>(null);

function useAlertDialog() {
  const context = React.useContext(AlertDialogContext);
  if (!context) {
    throw new Error("AlertDialog components must be used within <AlertDialog />");
  }
  return context;
}

function AlertDialog({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <AlertDialogContext.Provider value={{ open, setOpen: onOpenChange }}>
      {children}
    </AlertDialogContext.Provider>
  );
}

function AlertDialogTrigger({
  asChild = false,
  children,
}: {
  asChild?: boolean;
  children: React.ReactElement;
}) {
  const { open, setOpen } = useAlertDialog();
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      type={asChild ? undefined : "button"}
      aria-expanded={open}
      onClick={() => setOpen(!open)}
    >
      {children}
    </Comp>
  );
}

function AlertDialogContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { open, setOpen } = useAlertDialog();

  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, setOpen]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100000] flex items-center justify-center p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          setOpen(false);
        }
      }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        role="alertdialog"
        aria-modal="true"
        className={cn(
          "relative z-[100001] w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-950 p-5 text-slate-100 shadow-2xl shadow-black/50",
          className
        )}
      >
        <button
          type="button"
          aria-label="Close alert"
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 rounded-full border border-slate-800 bg-slate-900 p-2 text-slate-400 transition-colors hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}

function AlertDialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("space-y-1.5 text-left", className)} {...props} />;
}

function AlertDialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

function AlertDialogTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 className={cn("text-lg font-semibold leading-none text-white", className)} {...props} />;
}

function AlertDialogDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-sm leading-6 text-slate-400", className)} {...props} />;
}

function AlertDialogAction({
  className,
  onClick,
  ...props
}: React.ComponentProps<"button">) {
  const { setOpen } = useAlertDialog();
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-md bg-rose-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-400 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
      onClick={(event) => {
        onClick?.(event);
        setOpen(false);
      }}
    />
  );
}

function AlertDialogCancel({
  className,
  onClick,
  ...props
}: React.ComponentProps<"button">) {
  const { setOpen } = useAlertDialog();
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-md border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-100 transition-colors hover:bg-slate-800 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
      onClick={(event) => {
        onClick?.(event);
        setOpen(false);
      }}
    />
  );
}

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
