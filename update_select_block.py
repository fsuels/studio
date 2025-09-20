from pathlib import Path
path = Path(r'src\\components\\forms\\DynamicField.tsx')
text = path.read_text(encoding='utf-8')
old = "    case 'select':\n      return (\n        <Select onValueChange={field.onChange} value={field.value}>\n          <SelectTrigger>\n            <SelectValue placeholder={config.placeholder || `Select ${config.label}`} />\n          </SelectTrigger>\n          <SelectContent>\n            {config.options?.map((option) => (\n              <SelectItem key={option.value} value={option.value}>\n                {option.label}\n              </SelectItem>\n            ))}\n          </SelectContent>\n        </Select>\n      );"
new = "    case 'select':\n      return (\n        <Select\n          onValueChange={field.onChange}\n          value={field.value}\n          name={config.id}\n          aria-labelledby={labelId}\n          aria-label={config.label}\n        >\n          <SelectTrigger id={config.id} aria-labelledby={labelId}>\n            <SelectValue placeholder={config.placeholder || `Select ${config.label}`} />\n          </SelectTrigger>\n          <SelectContent>\n            {config.options?.map((option) => (\n              <SelectItem key={option.value} value={option.value}>\n                {option.label}\n              </SelectItem>\n            ))}\n          </SelectContent>\n        </Select>\n      );"
if old not in text:
    raise SystemExit('select block not found')
text = text.replace(old, new, 1)
path.write_text(text, encoding='utf-8')
