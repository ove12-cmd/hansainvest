const HTML_TAG_PATTERN = /<[a-z][\s\S]*>/i;

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;/gi, "'");
}

function stripTags(value: string): string {
  return value.replace(/<[^>]+>/g, " ");
}

/**
 * CMS exports (e.g. Webflow) often store a "rich text" field as raw HTML —
 * `<ul><li>one</li><li>two</li></ul>` — rather than plain delimited text.
 * Pulls clean list items out of that markup. Returns null when the input has
 * no HTML tags at all, so callers can fall back to their own plain-text
 * splitting convention (semicolons, newlines, ...).
 */
export function extractHtmlListItems(raw: string): string[] | null {
  if (!HTML_TAG_PATTERN.test(raw)) return null;

  const listItems = [...raw.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)];
  if (listItems.length > 0) {
    return listItems.map((match) => decodeHtmlEntities(stripTags(match[1])).trim()).filter(Boolean);
  }

  // HTML without <li> tags (e.g. <p>one</p><p>two</p>, <br>-separated) — strip
  // tags and split on line/semicolon boundaries.
  return decodeHtmlEntities(stripTags(raw))
    .split(/\r?\n|;/)
    .map((v) => v.trim())
    .filter(Boolean);
}
