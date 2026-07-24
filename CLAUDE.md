# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture

This is a **Raycast extension** that integrates with [zoxide](https://github.com/ajeetdsouza/zoxide) (a smarter `cd` command) and [fzf](https://github.com/junegunn/fzf) for fuzzy filtering. macOS only.

No test framework is configured.

## Gotchas

- **Shell injection prevention** (`src/utils/misc.ts`): `base64ShellSanitize` encodes user input as base64 and decodes it inline in the shell command, avoiding direct string interpolation. Use it for any user-supplied value that reaches a shell command.
