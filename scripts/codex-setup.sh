#/usr/bin/env bash
set -euo pipefail

# Build the website locally.
nix build .#website

# Deploy the website.
nix run .#deploy-website