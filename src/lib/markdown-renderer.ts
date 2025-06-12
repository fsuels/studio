/**
 * Simple Markdown renderer used on the client or server to guarantee document
 * previews. It fetches the raw template from the public folder and replaces
 * `{{placeholder}}` tokens with bolded values from the provided form data.
 */
export async function renderMarkdown(
  docType: string,
  formData: Record<string, unknown>,
): Promise<string> {
  const templateUrl = `/templates/en/${docType}.md`;
  let template = '';
  try {
    const res = await fetch(templateUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    template = await res.text();
  } catch (err) {
    console.warn(`[renderMarkdown] template fetch failed: ${templateUrl}`, err);
    return '';
  }

  let result = template;
  for (const [key, value] of Object.entries(formData || {})) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      result = result.replace(regex, `**${String(value)}**`);
    } else {
      result = result.replace(regex, '____');
    }
  }

  // Replace any unreplaced tokens with blanks
  result = result.replace(/\{\{.*?\}\}/g, '____');
  return result;
}
