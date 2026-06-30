import esbuild from "esbuild";
import process from "process";
import builtins from "builtin-modules";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const prod = process.argv[2] === "production";

const copyToVault = {
  name: 'copy-to-vault',
  setup(build) {
    build.onEnd(result => {
      if (process.env.VAULT_PATH) {
        const vaultPluginPath = path.join(process.env.VAULT_PATH, ".obsidian", "plugins", "obFileType");
        
        try {
            if (!fs.existsSync(vaultPluginPath)) {
            fs.mkdirSync(vaultPluginPath, { recursive: true });
            }
            
            fs.copyFileSync("main.js", path.join(vaultPluginPath, "main.js"));
            fs.copyFileSync("manifest.json", path.join(vaultPluginPath, "manifest.json"));
            
            console.log(`\x1b[32mSuccessfully copied main.js and manifest.json to ${vaultPluginPath}\x1b[0m`);
        } catch (e) {
            console.error(`\x1b[31mFailed to copy files to Vault: ${e.message}\x1b[0m`);
        }
      }
    });
  },
};

esbuild.build({
  entryPoints: ["main.ts"],
  bundle: true,
  external: [
    "obsidian",
    "electron",
    "@codemirror/autocomplete",
    "@codemirror/collab",
    "@codemirror/commands",
    "@codemirror/language",
    "@codemirror/lint",
    "@codemirror/search",
    "@codemirror/state",
    "@codemirror/view",
    "@lezer/common",
    "@lezer/highlight",
    "@lezer/lr",
    ...builtins
  ],
  format: "cjs",
  target: "es2018",
  logLevel: "info",
  sourcemap: prod ? false : "inline",
  treeShaking: true,
  outfile: "main.js",
  plugins: [copyToVault],
}).catch(() => process.exit(1));
