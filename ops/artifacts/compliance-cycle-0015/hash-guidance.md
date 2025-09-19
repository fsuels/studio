# Hash Logging Guidance

Use the commands below to capture SHA256 hashes for consent telemetry files and translated markdown once delivered.

## Windows PowerShell
```
Get-FileHash -Algorithm SHA256 ops/artifacts/compliance-cycle-0015/consent-telemetry/consent-events.csv
Get-FileHash -Algorithm SHA256 docs/legal/es/disclaimer.md
```

## Git Bash / macOS / Linux
```
shasum -a 256 ops/artifacts/compliance-cycle-0015/consent-telemetry/consent-events.csv
shasum -a 256 docs/legal/es/disclaimer.md
```

Paste results into:
- ops/artifacts/compliance-cycle-0015/consent-telemetry/hashes.txt
- ops/artifacts/compliance-cycle-0014/policy-translation-receipt-template.md (File Hash Log table)