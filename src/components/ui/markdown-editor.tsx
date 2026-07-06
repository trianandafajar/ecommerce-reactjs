import { useEffect, useRef, useState } from "react";
import { Bold, Italic, List, Quote, Eraser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type MarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  helperText?: string;
};

function wrapSelection(
  textarea: HTMLTextAreaElement,
  before: string,
  after = before,
  fallbackText = "",
) {
  const { selectionStart, selectionEnd, value } = textarea;
  const hasSelection = selectionStart !== selectionEnd;
  const selected = hasSelection
    ? value.slice(selectionStart, selectionEnd)
    : fallbackText;
  const nextValue =
    value.slice(0, selectionStart) +
    before +
    selected +
    after +
    value.slice(selectionEnd);
  const nextCursor = selectionStart + before.length + selected.length + after.length;

  return {
    nextValue,
    nextCursor,
  };
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder,
  className,
  label = "Description",
  helperText = "Use bold, italic, list, and quote shortcuts.",
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const updateValue = (nextValue: string) => {
    setLocalValue(nextValue);
    onChange(nextValue);
  };

  const applyFormatting = (kind: "bold" | "italic" | "bullet" | "quote" | "clear") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.focus();

    if (kind === "clear") {
      updateValue("");
      return;
    }

    if (kind === "bullet") {
      const lines = textarea.value.split("\n");
      const nextValue = lines
        .map((line) => (line.trim() ? (line.trimStart().startsWith("- ") ? line : `- ${line}`) : line))
        .join("\n");
      updateValue(nextValue);
      return;
    }

    if (kind === "quote") {
      const lines = textarea.value.split("\n");
      const nextValue = lines
        .map((line) => (line.trim() ? (line.trimStart().startsWith("> ") ? line : `> ${line}`) : line))
        .join("\n");
      updateValue(nextValue);
      return;
    }

    const { nextValue, nextCursor } = wrapSelection(
      textarea,
      kind === "bold" ? "**" : "*",
    );
    updateValue(nextValue);
    window.requestAnimationFrame(() => {
      textarea.setSelectionRange(nextCursor, nextCursor);
    });
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="space-y-0.5">
        <label className="text-sm font-medium text-slate-200">{label}</label>
        {helperText ? <p className="text-xs text-slate-500">{helperText}</p> : null}
      </div>

      <div className="flex flex-wrap items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 rounded-md px-3 text-slate-300 hover:bg-white/5 hover:text-white"
          onClick={() => applyFormatting("bold")}
        >
          <Bold className="h-4 w-4" />
          Bold
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 rounded-md px-3 text-slate-300 hover:bg-white/5 hover:text-white"
          onClick={() => applyFormatting("italic")}
        >
          <Italic className="h-4 w-4" />
          Italic
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 rounded-md px-3 text-slate-300 hover:bg-white/5 hover:text-white"
          onClick={() => applyFormatting("bullet")}
        >
          <List className="h-4 w-4" />
          List
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 rounded-md px-3 text-slate-300 hover:bg-white/5 hover:text-white"
          onClick={() => applyFormatting("quote")}
        >
          <Quote className="h-4 w-4" />
          Quote
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 rounded-md px-3 text-slate-300 hover:bg-white/5 hover:text-white"
          onClick={() => applyFormatting("clear")}
        >
          <Eraser className="h-4 w-4" />
          Clear
        </Button>
      </div>

      <Textarea
        ref={textareaRef}
        value={localValue}
        onChange={(event) => updateValue(event.target.value)}
        placeholder={placeholder}
        className="min-h-40 rounded-md border-slate-700 bg-slate-950 text-white placeholder:text-slate-500 focus-visible:ring-[#00A9AA]/30"
      />
    </div>
  );
}
