---
wave: 1
depends_on: []
files_modified:
  - "README.md"
  - "manifest.json"
autonomous: false
---

# Phase 06: Documentation & Community Submission

## Goal
Create an SEO-optimized `README.md` highlighting the plugin's native text editing capabilities and submit it to the `obsidianmd/obsidian-releases` repository.

## Requirements
PUB-02, PUB-04

## Tasks

<task>
<id>06-01-pre-flight</id>
<name>Audit Manifest and Repo Settings</name>
<read_first>
- `manifest.json`
- `LICENSE`
</read_first>
<action>
Review `manifest.json` to ensure the `id` is correct, and the `description` does not redundantly include the word "Obsidian" but aligns with "Open any text file natively". If it contains redundant text or needs refinement for SEO, modify `manifest.json` appropriately. Verify that a valid `LICENSE` file exists in the repository. Verify that the GitHub Release artifacts (`main.js`, `manifest.json`, `styles.css`) are present as standalone files. Verify that the release tag exactly matches the version number in `manifest.json` without a 'v' prefix.
</action>
<acceptance_criteria>
- `cat manifest.json` contains a concise `description` without redundant uses of "Obsidian" and an accurate `id`.
- `ls LICENSE` confirms the existence of a valid `LICENSE` file.
- GitHub Release artifacts (`main.js`, `manifest.json`, `styles.css`) are verified to be present as standalone files.
- The release tag is verified to exactly match the version number in `manifest.json` without a 'v' prefix.
</acceptance_criteria>
</task>

<task>
<id>06-02-readme</id>
<name>Update README.md for SEO and Users</name>
<read_first>
- `README.md`
- `manifest.json`
</read_first>
<action>
Rewrite `README.md` to be comprehensive and SEO-optimized. Include the target keywords: "open text files", "plaintext editor", "arbitrary text extensions", "native file editor". The 1-liner description should be "Open any text file natively in Obsidian." Include sections for 'Features', 'Supported File Types', 'Installation', and a placeholder for an animated GIF demonstration: `![Demo](demo.gif) <!-- USER: Please replace demo.gif with actual animated GIF screen recording -->`.
</action>
<acceptance_criteria>
- `cat README.md` output contains the strings "open text files", "plaintext editor", "arbitrary text extensions", and "native file editor".
- `cat README.md` output contains the string `![Demo](demo.gif)`.
- `cat README.md` output contains `## Features`, `## Supported File Types`, and `## Installation`.
</acceptance_criteria>
</task>

<task>
<id>06-03-submit-pr</id>
<name>Submit Community Plugin Pull Request</name>
<read_first>
- `manifest.json`
</read_first>
<action>
Clone `https://github.com/obsidianmd/obsidian-releases.git` to a temporary directory outside the current project. Create a new branch. Add an entry for `obFileType` to `community-plugins.json` using the data from this project's `manifest.json`. Commit the changes. Use the `gh` CLI to fork the repository, push the branch, and create a pull request. If the executor lacks permissions or cannot authenticate, halt and instruct the user to run the PR creation manually.
</action>
<acceptance_criteria>
- The `gh pr list --repo obsidianmd/obsidian-releases --author "@me"` command shows an open pull request for the plugin, OR the executor has provided clear manual instructions to the user to open the PR if autonomous creation failed.
</acceptance_criteria>
</task>

## Verification
- Run `cat README.md` and verify it contains all required sections and keywords.
- Verify `manifest.json` `description` is concise and compliant.
- Ensure the PR has been opened or the user has been explicitly handed off the PR submission step.

## Must Haves
- The `README.md` must contain the required SEO keywords and sections.
- The `manifest.json` description must not redundantly include the word "Obsidian".

## Artifacts this phase produces
- No new source code symbols are created in this phase.

<threat_model>
- **Threat**: The pull request could fail validation bot checks if the `manifest.json` description contains "Obsidian" redundantly.
  - **Mitigation**: Task `06-01-pre-flight` explicitly checks and corrects the `manifest.json` description.
  - **Severity**: Low
- **Threat**: The GitHub CLI (`gh`) might not be authenticated for the user, preventing automated PR creation.
  - **Mitigation**: Task `06-03-submit-pr` explicitly accounts for this by falling back to instructing the user.
  - **Severity**: Medium
</threat_model>
