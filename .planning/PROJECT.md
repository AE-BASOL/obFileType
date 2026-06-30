# obFileType

## What This Is

An Obsidian plugin that allows users to open, view, edit, and save text-based files (e.g., JSON, YAML, C, etc.) natively within Obsidian, similar to how VS Code handles them. It provides syntax highlighting and a settings page to configure supported file extensions.

## Core Value

Enable users to seamlessly edit arbitrary text-based files directly within Obsidian without relying on external editors.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Support opening, editing, and saving arbitrary text-based file formats (JSON, YAML, C, etc.).
- [ ] Provide syntax highlighting for supported text formats.
- [ ] Implement a settings tab to let users add or remove custom file extensions to be treated as text.
- [ ] Integrate into the Obsidian Community Plugins ecosystem (can be enabled/disabled).

### Out of Scope

- Full IDE features (e.g., debugging, intellisense, advanced refactoring) — the plugin is intended to be a simple text editor for viewing and editing files with basic syntax highlighting.
- Binary file support (e.g., Excel, PPTX, images) — out of scope as Obsidian inherently doesn't handle arbitrary binaries in text views.

## Context

- The user wants an experience similar to Visual Studio Code for text files inside Obsidian.
- Needs to be published/configured as a standard Obsidian Community Plugin.
- GitHub repository for sync: https://github.com/AE-BASOL/obFileType.git.

## Constraints

- **Platform**: Obsidian Plugin API — Must be built as a standard Obsidian plugin (TypeScript).
- **Format**: Text only — Designed strictly for text-based decoding and encoding.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Syntax Highlighting | Makes viewing code and config files significantly easier (User requested) | — Pending |
| Customizable Extensions | Users may have proprietary or less common text extensions (.conf, .log) they want to open | — Pending |

## Current State

- **v1.0 MVP**: Shipped 2026-06-30. The plugin allows users to open text files in Obsidian, provides basic CodeMirror syntax highlighting, and features a settings tab to configure extensions.
- **v1.1 Local Testing**: Shipped 2026-06-30. The plugin build script is configured to optionally push to the user's Obsidian Vault if `.env` specifies `VAULT_PATH`.

## Current Milestone: v1.2 Community Publication

**Goal:** Publish the plugin officially to the Obsidian Community Plugins registry.

**Target features:**
- Resolve GitHub push issues and set up remote sync.
- Create automated GitHub Actions release workflow.
- Write SEO-optimized, user-friendly README documentation.
- Submit a Pull Request to obsidianmd/obsidian-releases.

---
*Last updated: 2026-06-30 after v1.1 release*
