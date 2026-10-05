import { Fragment } from "react";

// Headings edited in /admin/sisu are plain text, so two conventions keep the
// design intact without a rich-text editor: a newline is a line break, and
// *stars* wrap the brand-coloured words.
export function RichText({ value }: { value: string }) {
  return value.split("\n").map((line, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {line.split(/\*([^*]+)\*/).map((part, j) =>
        j % 2 === 1 ? (
          <span key={j} className="text-brand">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </Fragment>
  ));
}
