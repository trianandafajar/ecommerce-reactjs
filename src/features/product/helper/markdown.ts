const HTML_ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char] ?? char);
}

function applyInlineFormatting(value: string) {
  return value
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}

export function formatMarkdown(value?: string | null) {
  if (!value) {
    return "";
  }

  const lines = value.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let inList = false;

  const closeList = () => {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      closeList();
      return;
    }

    const listMatch = trimmed.match(/^(?:-|\*|\u2022)\s+(.+)$/);
    if (listMatch) {
      if (!inList) {
        html.push('<ul class="list-disc space-y-2 pl-5">');
        inList = true;
      }
      html.push(`<li>${applyInlineFormatting(escapeHtml(listMatch[1]))}</li>`);
      return;
    }

    closeList();
    html.push(
      `<p class="leading-6 text-slate-300">${applyInlineFormatting(
        escapeHtml(trimmed),
      )}</p>`,
    );
  });

  closeList();

  return html.join("");
}

export function stripMarkdown(value?: string | null) {
  if (!value) {
    return "";
  }

  return value
    .replace(/\r\n/g, "\n")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/^(?:-|\*|\u2022)\s+/gm, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{2,}/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
