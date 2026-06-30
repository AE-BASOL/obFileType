import { App, Plugin, PluginSettingTab, Setting, TextFileView, WorkspaceLeaf } from 'obsidian';
import { EditorState, Extension } from '@codemirror/state';
import { EditorView, lineNumbers, keymap } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';

import { json } from '@codemirror/lang-json';
import { cpp } from '@codemirror/lang-cpp';
import { yaml } from '@codemirror/lang-yaml';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { python } from '@codemirror/lang-python';
import { sql } from '@codemirror/lang-sql';
import { xml } from '@codemirror/lang-xml';
import { java } from '@codemirror/lang-java';

import { StreamLanguage, syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language';
import { shell } from '@codemirror/legacy-modes/mode/shell';
import { ruby } from '@codemirror/legacy-modes/mode/ruby';
import { swift } from '@codemirror/legacy-modes/mode/swift';
import { rust } from '@codemirror/legacy-modes/mode/rust';
import { toml } from '@codemirror/legacy-modes/mode/toml';
import { oCaml } from '@codemirror/legacy-modes/mode/mllike';
import { powerShell } from '@codemirror/legacy-modes/mode/powershell';
import { properties } from '@codemirror/legacy-modes/mode/properties';
import { gas } from '@codemirror/legacy-modes/mode/gas';
import { stex } from '@codemirror/legacy-modes/mode/stex';
import { d } from '@codemirror/legacy-modes/mode/d';

export const VIEW_TYPE_OB_FILE = "ob-file-type-view";

interface ObFileTypeSettings {
    extensions: string;
}

const DEFAULT_SETTINGS: ObFileTypeSettings = {
    extensions: "json, yaml, yml, c, cpp, h, hpp, js, ts, tsx, txt, html, css, py, sh, sql, xml, java, swift, rs, toml, ini, ml, rb, ps1, bat, cmd, csv, log, asm, s, tex, env, label, d, nix, mk, conf"
}

class ObFileTypeView extends TextFileView {
    private editor: EditorView | null = null;

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }

    getViewData(): string {
        return this.editor ? this.editor.state.doc.toString() : this.data;
    }

    setViewData(data: string, clear: boolean): void {
        this.data = data;
        this.contentEl.empty();

        let ext = this.file?.extension || "";
        let languageExt: Extension = [];

        switch (ext) {
            case "json": languageExt = json(); break;
            case "yaml":
            case "yml": languageExt = yaml(); break;
            case "c": 
            case "cpp": 
            case "h": 
            case "hpp": languageExt = cpp(); break;
            case "js":
            case "ts":
            case "tsx": languageExt = javascript({ typescript: ["ts", "tsx"].includes(ext) }); break;
            case "html": languageExt = html(); break;
            case "css": languageExt = css(); break;
            case "py": languageExt = python(); break;
            case "sql": languageExt = sql(); break;
            case "xml": languageExt = xml(); break;
            case "java": languageExt = java(); break;
            case "sh":
            case "bat":
            case "cmd": languageExt = StreamLanguage.define(shell); break;
            case "ps1": languageExt = StreamLanguage.define(powerShell); break;
            case "rb": languageExt = StreamLanguage.define(ruby); break;
            case "swift": languageExt = StreamLanguage.define(swift); break;
            case "rs": languageExt = StreamLanguage.define(rust); break;
            case "toml":
            case "ini":
            case "conf": languageExt = StreamLanguage.define(toml); break;
            case "ml": languageExt = StreamLanguage.define(oCaml); break;
            case "env":
            case "mk": languageExt = StreamLanguage.define(properties); break;
            case "asm":
            case "s": languageExt = StreamLanguage.define(gas); break;
            case "tex": languageExt = StreamLanguage.define(stex); break;
            case "d": languageExt = StreamLanguage.define(d); break;
            case "nix": languageExt = StreamLanguage.define(shell); break;
        }

        const updateListener = EditorView.updateListener.of((update) => {
            if (update.docChanged) {
                this.requestSave();
            }
        });

        const state = EditorState.create({
            doc: data,
            extensions: [
                lineNumbers(),
                history(),
                keymap.of([...defaultKeymap, ...historyKeymap]),
                languageExt,
                syntaxHighlighting(defaultHighlightStyle, {fallback: true}),
                updateListener,
                EditorView.theme({
                    "&": { height: "100%", width: "100%" },
                    ".cm-scroller": { overflow: "auto" }
                })
            ]
        });

        this.editor = new EditorView({
            state,
            parent: this.contentEl
        });
    }

    getViewType(): string {
        return VIEW_TYPE_OB_FILE;
    }

    getDisplayText(): string {
        return this.file ? this.file.name : "Custom File";
    }

    clear(): void {
        this.data = "";
        if (this.editor) {
            this.editor.destroy();
            this.editor = null;
        }
        this.contentEl.empty();
    }
}

class ObFileTypeSettingTab extends PluginSettingTab {
    plugin: ObFileTypePlugin;

    constructor(app: App, plugin: ObFileTypePlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const {containerEl} = this;

        containerEl.empty();

        new Setting(containerEl)
            .setName('Supported file extensions')
            .setDesc('Comma-separated list of file extensions to open with obFileType. Requires app restart for removal.')
            .addTextArea(text => text
                .setPlaceholder('json, yaml, c')
                .setValue(this.plugin.settings.extensions)
                .onChange(async (value) => {
                    this.plugin.settings.extensions = value;
                    await this.plugin.saveSettings();
                    this.plugin.applyExtensions();
                }));
    }
}

export default class ObFileTypePlugin extends Plugin {
    settings: ObFileTypeSettings;

    async onload() {
        await this.loadSettings();

        this.registerView(
            VIEW_TYPE_OB_FILE,
            (leaf: WorkspaceLeaf) => new ObFileTypeView(leaf)
        );

        this.applyExtensions();

        this.addSettingTab(new ObFileTypeSettingTab(this.app, this));
    }

    applyExtensions() {
        const extensions = this.settings.extensions.split(",").map(e => e.trim()).filter(e => e.length > 0);
        try {
            this.registerExtensions(extensions, VIEW_TYPE_OB_FILE);
        } catch (e) {
            console.log("Some extensions could not be registered by obFileType (might be already registered)", e);
        }
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async onunload() {
    }
}
