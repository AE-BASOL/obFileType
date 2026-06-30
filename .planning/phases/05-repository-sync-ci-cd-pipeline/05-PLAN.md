---
wave: 1
depends_on: []
files_modified:
  - ".git/config"
  - ".github/workflows/release.yml"
autonomous: false
requirements:
  - PUB-03
  - PUB-01
---

# Phase 5: Repository Sync & CI/CD Pipeline - Plan

## Phase Goal
Resolve git push issues (HTTP 500) and establish a GitHub Actions workflow to automatically build and release the Obsidian plugin on version tags.

## Tasks

<task>
  <id>task-1-fix-git-push</id>
  <read_first>.git/config</read_first>
  <action>Inspect current git repository state using `git status` and `.git/config`. If git is not initialized, run `git init` and add remote origin. If pushing fails with HTTP 500, change the remote URL from HTTPS to SSH (`git remote set-url origin git@github.com:<username>/ob_fileType.git`) or configure `http.postBuffer` to `524288000` (`git config http.postBuffer 524288000`). Commit any pending changes.</action>
  <acceptance_criteria>The command `git push origin main` (or the default branch) completes successfully without HTTP 500 errors.</acceptance_criteria>
</task>

<task>
  <id>task-2-create-ci-cd-workflow</id>
  <read_first>.github/workflows/release.yml</read_first>
  <action>Create the `.github/workflows/release.yml` file to build and release the Obsidian plugin. Ensure it is triggered by `push` on tags matching `v*`. The workflow should checkout the repo, setup Node 18.x, install dependencies, run build, create an empty `styles.css` file (`touch styles.css`), and use `gh release create` to upload `main.js`, `manifest.json`, and `styles.css`. Include `permissions: contents: write`.</action>
  <acceptance_criteria>The file `.github/workflows/release.yml` exists, is formatted correctly as YAML, and includes steps to generate and upload `main.js`, `manifest.json`, and `styles.css`.</acceptance_criteria>
</task>

<task>
  <id>task-3-test-workflow</id>
  <read_first>.github/workflows/release.yml</read_first>
  <action>Create a test tag locally (e.g., `git tag v1.2.0-test`) and push it to the remote repository (`git push origin v1.2.0-test`). Monitor the GitHub Actions workflow in the remote repository to ensure it successfully builds and creates a release.</action>
  <acceptance_criteria>A release tag `v1.2.0-test` exists on the GitHub repository, and the GitHub Action completes successfully, publishing `main.js`, `manifest.json`, and `styles.css` to the release.</acceptance_criteria>
</task>

## Verification Criteria
- [ ] Local git repository is successfully pushed to the remote GitHub repository without HTTP 500 errors.
- [ ] Pushing a new version tag automatically triggers the GitHub Actions workflow.
- [ ] The GitHub Actions workflow successfully produces a GitHub Release containing `main.js`, `manifest.json`, and `styles.css`.

## must_haves
- Remote git repository URL is correctly configured and working.
- `.github/workflows/release.yml` is created and configured for releasing on tags starting with `v`.
- The release workflow includes `main.js`, `manifest.json`, and `styles.css` as artifacts.

## Artifacts this phase produces
- `.github/workflows/release.yml` (New CI/CD workflow file)
