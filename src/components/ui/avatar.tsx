import * as React from "react";

import { cn } from "@/lib/utils";

function Avatar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border border-slate-800 bg-slate-900",
        className
      )}
      {...props}
    />
  );
}

function AvatarImage({ className, alt, ...props }: React.ComponentProps<"img">) {
  return <img alt={alt} className={cn("aspect-square h-full w-full object-cover", className)} {...props} />;
}

function AvatarFallback({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-slate-900 text-xs font-semibold uppercase text-slate-200",
        className
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
