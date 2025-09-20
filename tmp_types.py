import pathlib
import re

types = set()
for path in pathlib.Path(''src/lib/documents'').rglob(''questions.ts''):
    text = path.read_text(encoding='utf-8')
    types.update(re.findall(r"type:\s*'([^']+)'", text))

print(sorted(types))
