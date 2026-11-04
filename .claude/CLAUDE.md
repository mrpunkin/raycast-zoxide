# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture

This is a **Raycast extension** that integrates with [zoxide](https://github.com/ajeetdsouza/zoxide) (a smarter `cd` command) and [fzf](https://github.com/junegunn/fzf) for fuzzy filtering. macOS only.

No test framework is configured.

## Gotchas

- **No shell for zoxide/fzf**: all zoxide commands live in `src/utils/zoxide.ts` and run the binary via `execFile` (fzf via `useExec(file, args)`), so user input is passed as arguments and needs no escaping. PATH comes from `pathFor()` (honors the additional path directories preference), not the shell. `execFile`'s `env` replaces the inherited environment (unlike `useExec`, which merges), so spread `process.env` to keep settings like `_ZO_DATA_DIR`.
- **Shell injection prevention** (`src/utils/misc.ts`): `base64ShellSanitize` encodes user input as base64 and decodes it inline in the shell command. Still required where a shell is used (currently only Spotlight); prefer the no-shell pattern above for new commands.
- **Score bump on open**: open actions are `Action.Open`/`Action.OpenWith` with `onOpen` calling the synchronous `addToZoxide`. It must stay synchronous — opening the target tears the command down before async work finishes. `onOpen` with `application` set requires Raycast 2.11+.
- **This file's location**: `ray publish` copies everything in this folder to `raycast/extensions`, whose review rules forbid agent files like a root `CLAUDE.md`. Keep this file in `.claude/`, which upstream's `.gitignore` (`.claude**`) keeps out of the PR.
