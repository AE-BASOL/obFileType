# Phase 5 Research: Repository Sync & CI/CD Pipeline

## 1. Goal and Scope
The objective of this phase is to fix any repository synchronization issues (HTTP 500 errors on `git push`) and establish a GitHub Actions workflow to automatically build and release the Obsidian plugin whenever a new version tag is pushed.

## 2. Resolving the Git Push Error (HTTP 500)
A 500 Internal Server Error during `git push` indicates a server-side issue, typically related to authentication method, repository size, or temporary glitches. 

Based on research, here are the recommended approaches to fix this:
- **Switch from HTTPS to SSH (Recommended):** HTTPS pushes can sometimes fail with a 500 error due to authentication proxying. Updating the remote URL to SSH is the standard fix:
  `git remote set-url origin git@github.com:<username>/ob_fileType.git`
- **Increase Git HTTP Buffer Size:** If staying on HTTPS, the default buffer might be too small.
  `git config http.postBuffer 524288000`
- **Verify Repository State:** During exploration, the `.git/config` file was not found in the expected project root (`/Volumes/aebasol_1tb/Ob/Projects/ob_fileType`). You must verify if the repository was initialized correctly, and if not, run `git init`, add the files, and set the remote properly before pushing.

## 3. Creating the GitHub Actions Workflow (PUB-01)
To satisfy PUB-01, we need to create a release workflow that complies with Obsidian Community Plugin standards.

**Workflow Location:** `.github/workflows/release.yml`
**Trigger:** Must trigger on version tags (e.g., `v1.0.0`, `v1.2`). Use `tags: ["v*"]`.

**Workflow Steps:**
1. **Checkout:** Use `actions/checkout@v4`.
2. **Setup Node:** Use `actions/setup-node@v4` with Node `18.x` or `20.x`.
3. **Install Dependencies:** `npm install`.
4. **Build:** `npm run build` (This correctly generates `main.js` based on `esbuild.config.mjs`).
5. **Ensure Artifacts:** Obsidian releases require `main.js`, `manifest.json`, and `styles.css`. Since the plugin does not currently use custom CSS, we must ensure `styles.css` is present to avoid workflow failures.
   - *Decision:* We will explicitly create a blank `styles.css` during the CI build (`touch styles.css`).
6. **Create Release:** Use the official GitHub CLI (`gh release create`) to upload the 3 artifacts.

**Example `release.yml` Structure:**
```yaml
name: Release Obsidian Plugin
on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18.x'
      - name: Install dependencies
        run: npm install
      - name: Build
        run: npm run build
      - name: Create empty styles.css
        run: touch styles.css
      - name: Create Release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          gh release create ${{ github.ref_name }} \
            --title ${{ github.ref_name }} \
            --draft \
            main.js manifest.json styles.css
```

## 4. Constraints & Considerations
- **Artifact Names:** The `esbuild.config.mjs` outputs `main.js` which aligns with Obsidian requirements.
- **`styles.css` Requirement:** Creating `touch styles.css` dynamically in the GitHub Action is the cleanest way to satisfy Obsidian's requirement without polluting the repository with an empty file.
- **Workflow Permissions:** The GitHub Action requires `permissions: contents: write` to allow it to create a release and upload assets.

## 5. Implementation Steps for Next Agent
1. **Repository Sync:** 
   - Verify `git status`. Initialize git if necessary.
   - Configure the remote URL (prefer SSH to avoid 500 errors).
   - Ensure `git push` succeeds.
2. **CI/CD Pipeline Setup:**
   - Create the directory `.github/workflows/`.
   - Write `release.yml` adhering to the structure above.
   - Create a test tag (e.g., `v1.2.0-test`) and verify that the release successfully runs and uploads all three required files.
