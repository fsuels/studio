/**
 * jscodeshift transform to convert single-quoted strings
 * containing apostrophes into double-quoted strings.
 */

export default function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  root
    .find(j.Literal)
    .filter((path) => {
      if (!path.node || !path.node.raw) {
        return false;
      }
      const { raw, value } = path.node;
      return (
        typeof value === 'string' && raw.startsWith("'") && value.includes("'")
      );
    })
    .forEach((path) => {
      const text = path.node.value;
      // Escape any existing double-quotes in the text
      const escaped = text.replace(/"/g, '"'); // Corrected escaping for double quote
      // Build new raw using double-quotes
      path.node.raw = `"${escaped}"`;
    });

  return root.toSource({ quote: 'single' }); // keep other strings as-is
}
