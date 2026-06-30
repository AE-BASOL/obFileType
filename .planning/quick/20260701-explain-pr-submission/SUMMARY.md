---
status: complete
date: 2026-07-01
---

The user's question regarding why the PR was created from a temporary directory instead of the project root was answered. The reason is that Obsidian community plugin submissions require modifying the `obsidianmd/obsidian-releases` repository's `community-plugins.json` file, which involves forking and pushing to a completely different repository than the local plugin codebase.
