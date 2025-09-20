import json
import unicodedata
import urllib.parse
import urllib.request
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
MANIFEST_PATH = REPO_ROOT / 'src' / 'lib' / 'documents' / 'manifest.generated.json'
REPORT_PATH = REPO_ROOT / 'template-verification-report.json'
DOCUMENTS_DIR = REPO_ROOT / 'src' / 'lib' / 'documents'

manifest = json.loads(MANIFEST_PATH.read_text(encoding='utf-8'))
report = json.loads(REPORT_PATH.read_text(encoding='utf-8'))

manifest_by_id = {entry['id']: entry for entry in manifest['entries']}
mismatched_docs = {
    result['documentType']
    for result in report.get('results', [])
    if any('Metadata alias count mismatch' in error for error in result.get('errors', []))
}
def normalize_es(value: str) -> str:
    normalized = unicodedata.normalize('NFD', value.strip().lower())
    return ''.join(ch for ch in normalized if unicodedata.category(ch) != 'Mn')

def normalize_en(value: str) -> str:
    return value.strip().lower()

observed_translations: dict[str, set[str]] = {}
for entry in manifest['entries']:
    en_aliases = entry['meta']['translations']['en'].get('aliases', [])
    es_aliases = entry['meta']['translations']['es'].get('aliases', [])
    if len(en_aliases) == len(es_aliases) and en_aliases:
        for en_alias, es_alias in zip(en_aliases, es_aliases):
            candidate = es_alias.strip()
            if '(' in candidate:
                continue
            observed_translations.setdefault(normalize_en(en_alias), set()).add(candidate.lower())




TRANSLATION_OVERRIDES = {
    'marine bill of sale': 'factura de venta marítima',
    'boat bill of sale': 'factura de venta de embarcación',
    'auto maintenance agreement': 'acuerdo de mantenimiento automotriz',
    'car repair contract': 'contrato de reparación de automóvil',
    'donation agreement': 'acuerdo de donación',
    'cryptocurrency agreement': 'acuerdo de criptomonedas',
}

forced_docs = {
    entry['id']
    for entry in manifest['entries']
    if any(normalize_en(alias) in TRANSLATION_OVERRIDES for alias in entry['meta']['translations']['en'].get('aliases', []))
}

# mismatched docs now include override coverage
mismatched_docs = mismatched_docs.union(forced_docs)

BAD_SUBSTRINGS = ('(', 'bolsa de venta', 'automático')

translation_cache: dict[str, str] = {}

REMOVE_SUFFIXES = (
    '(plazo legal)',
    '(término legal)',
    '(término jurídico)',
    '(documento legal)',
    '(frase legal)',
    '(condición legal)',
    '(cláusula legal)',
)

def translate_alias(alias: str) -> str:
    alias = alias.strip()
    if not alias:
        return alias
    lower_key = alias.lower()
    if lower_key in TRANSLATION_OVERRIDES:
        return TRANSLATION_OVERRIDES[lower_key]
    if alias in translation_cache:
        return translation_cache[alias]

    params = {
        'client': 'gtx',
        'sl': 'en',
        'tl': 'es',
        'dt': 't',
        'q': f'{alias} (legal term)',
    }
    url = 'https://translate.googleapis.com/translate_a/single?' + urllib.parse.urlencode(params)
    with urllib.request.urlopen(url) as response:
        payload = json.loads(response.read().decode('utf-8'))
    translated = ''.join(chunk[0] for chunk in payload[0]) if payload and payload[0] else ''
    result = translated.strip() or alias
    lowered = result.lower()
    for suffix in REMOVE_SUFFIXES:
        if lowered.endswith(suffix):
            result = result[: -len(suffix)].strip()
            lowered = result.lower()
            break
    normalized = ' '.join(result.split()).lower()
    translation_cache[alias] = normalized
    return normalized

def ensure_unique_translation(candidate: str, english_alias: str, existing_norm: set[str]) -> str:
    base = candidate.strip().lower() or english_alias.strip().lower()
    if normalize_es(base) not in existing_norm:
        return base

    suffixes = [' legal', ' oficial', ' complementaria', ' alternativa', ' especializada', ' profesional']
    for suffix in suffixes:
        alt = base + suffix
        if normalize_es(alt) not in existing_norm:
            return alt

    fallback = f"{base} ({english_alias.lower()})"
    if normalize_es(fallback) not in existing_norm:
        return fallback

    counter = 2
    while normalize_es(f"{base} variante {counter}") in existing_norm:
        counter += 1
    return f"{base} variante {counter}"

def rewrite_alias_array(content: str, locale: str, aliases: list[str]) -> str:
    translations_idx = content.find('translations:')
    if translations_idx == -1:
        raise ValueError('Missing translations block')

    locale_marker = f"\n    {locale}: "
    locale_idx = content.find(locale_marker, translations_idx)
    if locale_idx == -1:
        locale_marker = f"{locale}: "
        locale_idx = content.find(locale_marker, translations_idx)
        if locale_idx == -1:
            raise ValueError(f'Missing locale block for {locale}')

    alias_idx = content.find('aliases', locale_idx)
    if alias_idx == -1:
        raise ValueError(f'Missing aliases array for {locale}')

    array_start = content.find('[', alias_idx)
    if array_start == -1:
        raise ValueError(f'Malformed aliases array for {locale}')

    depth = 0
    array_end = -1
    for idx in range(array_start, len(content)):
        char = content[idx]
        if char == '[':
            depth += 1
        elif char == ']':
            depth -= 1
            if depth == 0:
                array_end = idx
                break
    if array_end == -1:
        raise ValueError(f'Unmatched aliases bracket for {locale}')

    line_start = content.rfind('\n', 0, array_start) + 1
    line = content[line_start:array_start]
    whitespace = line[:len(line) - len(line.lstrip())]
    base_indent = whitespace
    item_indent = base_indent + '  '
    newline = '\r\n' if '\r\n' in content else '\n'

    escaped_aliases = [alias.replace('\\', '\\\\').replace("'", "\\'") for alias in aliases]
    if escaped_aliases:
        alias_lines = newline.join(f"{item_indent}'{alias}'," for alias in escaped_aliases)
        new_block = '[' + newline + alias_lines + newline + base_indent + ']'
    else:
        new_block = '[]'

    return content[:array_start] + new_block + content[array_end + 1:]

updates: list[tuple[str, str, str]] = []

for doc_id in sorted(mismatched_docs):
    entry = manifest_by_id.get(doc_id)
    if not entry:
        print(f"⚠️  {doc_id} missing from manifest, skipping.")
        continue

    en_aliases = entry['meta']['translations']['en'].get('aliases', [])
    es_aliases = entry['meta']['translations']['es'].get('aliases', [])

    existing_norm = set()
    rebuilt_aliases: list[str] = []

    for idx, english_alias in enumerate(en_aliases):
        lower_key = normalize_en(english_alias)
        selected = None

        override = TRANSLATION_OVERRIDES.get(lower_key)
        if override:
            selected = override
        elif idx < len(es_aliases):
            existing_candidate = es_aliases[idx].strip().lower()
            if existing_candidate and not any(bad in existing_candidate for bad in BAD_SUBSTRINGS):
                selected = existing_candidate

        if selected is None:
            for candidate in observed_translations.get(lower_key, set()):
                if normalize_es(candidate) not in existing_norm:
                    selected = candidate
                    break

        if selected is None:
            translated = translate_alias(english_alias)
            selected = translated

        selected = ensure_unique_translation(selected, english_alias, existing_norm)
        existing_norm.add(normalize_es(selected))
        rebuilt_aliases.append(selected)

    metadata_dir = entry['importPath'].lstrip('./')
    metadata_path = DOCUMENTS_DIR / metadata_dir / 'metadata.ts'

    content = metadata_path.read_text(encoding='utf-8')
    content = rewrite_alias_array(content, 'en', en_aliases)
    content = rewrite_alias_array(content, 'es', rebuilt_aliases)
    metadata_path.write_text(content, encoding='utf-8')

    updates.append((doc_id, en_aliases[-1], rebuilt_aliases[-1]))

if updates:
    print(f'Updated {len(updates)} metadata files:')
    for doc_id, english_alias, spanish_alias in updates:
        print(f" - {doc_id}: ensured parity for '{english_alias}' with '{spanish_alias}'")
else:
    print('No metadata files were updated.')
