import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: "default",
};

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: "exit-block",
			name: "Exit to the right of the block",
			hotkeys: [{ modifiers: [], key: "Escape" }],
			editorCallback: (editor: Editor, view: MarkdownView) => {
				const cursor = editor.getCursor();
				const line = editor.getLine(cursor.line);

				// TODO: Add code blocks
				const matches = line.matchAll(/\$\$(.+?)\$\$|\$(.+?)\$/g);
				if (!matches) return;

				for (const match of matches) {
					const end = match.index + match[0].length;
					if (match.index < cursor.ch && cursor.ch < end) {
						editor.setCursor(cursor.line, end);
					}
				}
			},
		});
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
