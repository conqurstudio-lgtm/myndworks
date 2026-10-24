import {
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { BlogContentRenderer } from "./BlogContentRenderer";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function BlogEditor({ value, onChange }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showPreview, setShowPreview] = useState(false);

  function restoreSelection(start: number, end: number) {
    window.requestAnimationFrame(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(start, end);
    });
  }

  function wrapSelection(
    before: string,
    after: string,
    placeholder: string,
  ) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.slice(start, end) || placeholder;

    const next =
      value.slice(0, start) +
      before +
      selected +
      after +
      value.slice(end);

    onChange(next);
    restoreSelection(
      start + before.length,
      start + before.length + selected.length,
    );
  }

  function prefixLine(prefix: string) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursor = textarea.selectionStart;
    const lineStart = value.lastIndexOf("\n", cursor - 1) + 1;

    onChange(
      value.slice(0, lineStart) +
        prefix +
        value.slice(lineStart),
    );

    restoreSelection(
      cursor + prefix.length,
      cursor + prefix.length,
    );
  }

  function insertDivider() {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursor = textarea.selectionStart;
    const insertion = "\n\n---\n\n";

    onChange(
      value.slice(0, cursor) +
        insertion +
        value.slice(cursor),
    );

    restoreSelection(
      cursor + insertion.length,
      cursor + insertion.length,
    );
  }

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    onChange(event.target.value);
  }

  return (
    <div className="mw-blog-editor-box">
      <div className="mw-blog-format-toolbar">
        <button type="button" onClick={() => prefixLine("## ")}>
          H2
        </button>

        <button type="button" onClick={() => prefixLine("### ")}>
          H3
        </button>

        <button
          type="button"
          onClick={() => wrapSelection("**", "**", "bold text")}
        >
          <strong>B</strong>
        </button>

        <button
          type="button"
          onClick={() => wrapSelection("*", "*", "italic text")}
        >
          <em>I</em>
        </button>

        <button type="button" onClick={() => prefixLine("- ")}>
          • List
        </button>

        <button type="button" onClick={() => prefixLine("1. ")}>
          1. List
        </button>

        <button type="button" onClick={() => prefixLine("> ")}>
          Quote
        </button>

        <button
          type="button"
          onClick={() =>
            wrapSelection("[", "](https://example.com)", "link text")
          }
        >
          Link
        </button>

        <button type="button" onClick={insertDivider}>
          Divider
        </button>

        <button
          type="button"
          className={showPreview ? "is-active" : ""}
          onClick={() => setShowPreview((current) => !current)}
        >
          Preview
        </button>
      </div>

      <textarea
        ref={textareaRef}
        className="mw-blog-content-editor"
        rows={20}
        value={value}
        onChange={handleChange}
        placeholder="Write the article here..."
      />

      <div className="mw-blog-format-help">
        Select text before using Bold, Italic or Link. Headings,
        lists and quotes apply to the current line.
      </div>

      {showPreview && (
        <div className="mw-blog-editor-preview">
          <span className="mw-admin-label">Preview</span>
          <BlogContentRenderer content={value} />
        </div>
      )}
    </div>
  );
}
