import type { ReactNode } from "react";

type Props = {
  content: string;
  className?: string;
};

function safeHref(value: string) {
  const href = value.trim();

  if (
    href.startsWith("https://") ||
    href.startsWith("http://") ||
    href.startsWith("mailto:")
  ) {
    return href;
  }

  return "#";
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const pattern =
    /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*)/g;

  return text.split(pattern).map((part, index) => {
    const key = `${keyPrefix}-${index}`;
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);

    if (linkMatch) {
      const href = safeHref(linkMatch[2]);

      return (
        <a
          key={key}
          href={href}
          target={href === "#" ? undefined : "_blank"}
          rel={href === "#" ? undefined : "noreferrer"}
        >
          {linkMatch[1]}
        </a>
      );
    }

    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={key}>{part.slice(2, -2)}</strong>;
    }

    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={key}>{part.slice(1, -1)}</em>;
    }

    return part;
  });
}

export function BlogContentRenderer({
  content,
  className = "",
}: Props) {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();

    if (!line) {
      index += 1;
      continue;
    }

    if (line === "---") {
      blocks.push(<hr key={`hr-${index}`} />);
      index += 1;
      continue;
    }

    if (line.startsWith("### ")) {
      blocks.push(
        <h3 key={`h3-${index}`}>
          {renderInline(line.slice(4), `h3-${index}`)}
        </h3>,
      );
      index += 1;
      continue;
    }

    if (line.startsWith("## ")) {
      blocks.push(
        <h2 key={`h2-${index}`}>
          {renderInline(line.slice(3), `h2-${index}`)}
        </h2>,
      );
      index += 1;
      continue;
    }

    if (line.startsWith("> ")) {
      const quoteLines: string[] = [];

      while (
        index < lines.length &&
        lines[index].trim().startsWith("> ")
      ) {
        quoteLines.push(lines[index].trim().slice(2));
        index += 1;
      }

      blocks.push(
        <blockquote key={`quote-${index}`}>
          {quoteLines.map((quote, quoteIndex) => (
            <p key={`quote-${index}-${quoteIndex}`}>
              {renderInline(
                quote,
                `quote-${index}-${quoteIndex}`,
              )}
            </p>
          ))}
        </blockquote>,
      );
      continue;
    }

    if (/^[-*] /.test(line)) {
      const items: string[] = [];

      while (
        index < lines.length &&
        /^[-*] /.test(lines[index].trim())
      ) {
        items.push(lines[index].trim().slice(2));
        index += 1;
      }

      blocks.push(
        <ul key={`ul-${index}`}>
          {items.map((item, itemIndex) => (
            <li key={`ul-${index}-${itemIndex}`}>
              {renderInline(item, `ul-${index}-${itemIndex}`)}
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];

      while (
        index < lines.length &&
        /^\d+\.\s/.test(lines[index].trim())
      ) {
        items.push(
          lines[index].trim().replace(/^\d+\.\s/, ""),
        );
        index += 1;
      }

      blocks.push(
        <ol key={`ol-${index}`}>
          {items.map((item, itemIndex) => (
            <li key={`ol-${index}-${itemIndex}`}>
              {renderInline(item, `ol-${index}-${itemIndex}`)}
            </li>
          ))}
        </ol>,
      );
      continue;
    }

    const paragraphLines = [line];
    index += 1;

    while (index < lines.length) {
      const next = lines[index].trim();

      if (
        !next ||
        next === "---" ||
        next.startsWith("## ") ||
        next.startsWith("### ") ||
        next.startsWith("> ") ||
        /^[-*] /.test(next) ||
        /^\d+\.\s/.test(next)
      ) {
        break;
      }

      paragraphLines.push(next);
      index += 1;
    }

    blocks.push(
      <p key={`p-${index}`}>
        {paragraphLines.map((paragraphLine, paragraphIndex) => (
          <span key={`p-${index}-${paragraphIndex}`}>
            {paragraphIndex > 0 && <br />}
            {renderInline(
              paragraphLine,
              `p-${index}-${paragraphIndex}`,
            )}
          </span>
        ))}
      </p>,
    );
  }

  return (
    <div className={`mw-blog-rendered-content ${className}`.trim()}>
      {blocks}
    </div>
  );
}
