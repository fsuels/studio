# codex-autosession (ChatGPT Pro / no API billing)
This runner **uses Codex CLI with ChatGPT sign‑in** (included in Plus/Pro/Business/Enterprise), not the OpenAI API.
It loops tasks, commits/pushes after each step, and resumes from `Auto-Agents.md`, `Auto-Remember.md`, `Auto-Memory.md`.

> Windows note: Codex CLI officially supports macOS/Linux; **Windows is experimental** — use **WSL** for best results.

## Install Codex CLI
- macOS/Linux: `npm i -g @openai/codex` or `brew install codex`
- Windows: `npm i -g @openai/codex` (native) or install in **WSL** and run there.
- First run: `codex` → **Sign in with ChatGPT** (Pro plan is fine).

Docs:
- CLI & `exec`: https://developers.openai.com/codex/cli
- IDE extension: https://developers.openai.com/codex/ide

## Setup
1) Copy `codex-autosession.example.json` → `codex-autosession.json`, edit `repo_dir`, `model`, `reasoning`, etc.
2) Ensure your repo has remote configured (`git push -u origin <branch>` once).
3) Put `Auto-Agents.md`, `Auto-Remember.md`, `Auto-Memory.md` in the repo root (or let Codex create them with `/init`).

## Run (PowerShell)
```powershell
powershell -ExecutionPolicy Bypass -File .\codex-autosession.ps1
```
Stop by creating `codex.stop` in the repo root.

## Why this avoids token billing
Codex CLI can authenticate with **ChatGPT account**; usage is covered by your ChatGPT plan’s Codex limits. No API key is used here.

## Notes
- Each cycle is a fresh `codex exec` → context auto-rotates (no manual 20% tracking needed).
- If you *insist* on rotation by usage, you can insert a `codex exec "/status"` probe and parse "Token usage: …".


