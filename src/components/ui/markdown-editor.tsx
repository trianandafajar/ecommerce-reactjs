import { useEffect, useMemo, useRef, useState } from "react";
import { Bold, Italic, List, Quote, Sparkles, Eraser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { formatMarkdown } from "@/features/product/helper/markdown";

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
  helperText = "Use bold, italic, and list shortcuts. The preview shows how the product description will read.",
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const previewHtml = useMemo(() => formatMarkdown(localValue), [localValue]);

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
      <div className="flex items-end justify-between gap-3">
        <div>
          <label className="text-sm font-medium text-slate-200">{label}</label>
          <p className="mt-1 text-xs text-slate-500">{helperText}</p>
        </div>
        <div className="flex flex-wrap items-center gap-1 rounded-2xl border border-slate-800 bg-slate-950/60 p-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 rounded-full px-3 text-slate-300 hover:bg-white/5 hover:text-white"
            onClick={() => applyFormatting("bold")}
          >
            <Bold className="h-4 w-4" />
            Bold
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 rounded-full px-3 text-slate-300 hover:bg-white/5 hover:text-white"
            onClick={() => applyFormatting("italic")}
          >
            <Italic className="h-4 w-4" />
            Italic
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 rounded-full px-3 text-slate-300 hover:bg-white/5 hover:text-white"
            onClick={() => applyFormatting("bullet")}
          >
            <List className="h-4 w-4" />
            List
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 rounded-full px-3 text-slate-300 hover:bg-white/5 hover:text-white"
            onClick={() => applyFormatting("quote")}
          >
            <Quote className="h-4 w-4" />
            Quote
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 rounded-full px-3 text-slate-300 hover:bg-white/5 hover:text-white"
            onClick={() => applyFormatting("clear")}
          >
            <Eraser className="h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>

      <Textarea
        ref={textareaRef}
        value={localValue}
        onChange={(event) => updateValue(event.target.value)}
        placeholder={placeholder}
        className="min-h-40 border-slate-800 bg-slate-950 text-white placeholder:text-slate-500 focus-visible:ring-[#00A9AA]/30"
      />

      <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Preview</p>
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-slate-400">
            <Sparkles className="h-3.5 w-3.5" />
            Live
          </span>
        </div>
        <div
          className="mt-4 space-y-3 text-sm leading-6 text-slate-300"
          dangerouslySetInnerHTML={{
            __html:
              previewHtml ||
              '<p class="text-sm text-slate-500">Nothing to preview yet.</p>',
          }}
        />
      </div>
    </div>
  );
}
