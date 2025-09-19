import subprocess
import pathlib
import difflib

def write_diff(path):
    old = subprocess.check_output(['git', 'show', f'HEAD:{path}'], text=True)
    new = pathlib.Path(path).read_text()
    diff = difflib.unified_diff(old.splitlines(), new.splitlines(), fromfile=f'a/{path}', tofile=f'b/{path}', lineterm='')
    out_path = pathlib.Path('ops/tmp') / (path.replace('/', '_') + '.diff')
    out_path.write_text('\n'.join(diff) + '\n')

write_diff('public/templates/en/advance-directive.md')
write_diff('public/templates/es/advance-directive.md')
