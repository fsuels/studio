#!/usr/bin/env bash
set -euo pipefail

if grep -R "/docs/us/" src | grep -v "\.test\|\.spec"; then
  echo "❌ Hard-coded US paths found"
  exit 1
fi
