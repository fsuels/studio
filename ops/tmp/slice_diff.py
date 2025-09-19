from pathlib import Path
import subprocess
import difflib

path = Path('src/lib/legal-translation/LegalTranslationEngine.ts')
new = path.read_text().splitlines()
old = subprocess.run(['git','show','HEAD:src/lib/legal-translation/LegalTranslationEngine.ts'], capture_output=True, text=True, check=True).stdout.splitlines()
start = next(i for i, line in enumerate(old) if 'const terms: LegalTerm[] =' in line)
end = start
while end < len(old) and 'terms.forEach' not in old[end]:
    end += 1
old_slice = old[start:end]
new_start = next(i for i, line in enumerate(new) if 'const terms: LegalTerm[] =' in line)
new_end = new_start
while new_end < len(new) and 'terms.forEach' not in new[new_end]:
    new_end += 1
new_slice = new[new_start:new_end]
diff = '\n'.join(difflib.unified_diff(old_slice, new_slice, fromfile='a/src/lib/legal-translation/LegalTranslationEngine.ts', tofile='b/src/lib/legal-translation/LegalTranslationEngine.ts', lineterm=''))
Path('ops/tmp/legal_translation_diff.patch').write_text(diff, encoding='utf-8')
