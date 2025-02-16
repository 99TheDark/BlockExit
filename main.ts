import Bimap from "bimap";
import { Editor, Plugin } from "obsidian";

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: "default",
};

type Direction = "left" | "right";

const pattern = /```([^]*?)```|`([^\n`]+)`|\$\$(.+?)\$\$|\$(.+?)\$/g;

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: "exit-block-right",
			name: "Exit to the right of the block",
			hotkeys: [{ modifiers: [], key: "Escape" }],
			editorCallback: (editor, _) => this.exitBlock(editor, "right"),
		});

		this.addCommand({
			id: "exit-block-left",
			name: "Exit to the left of the block",
			hotkeys: [{ modifiers: ["Shift"], key: "Escape" }],
			editorCallback: (editor, _) => this.exitBlock(editor, "left"),
		});
	}

	exitBlock(editor: Editor, direction: Direction) {
		const cursor = editor.getCursor();
		const note = editor.getValue();
		// const line = editor.getLine(cursor.line);

		const indexMap = this.mapIndex(note);

		const cursorIndex = indexMap.getFor(cursor.line)! + cursor.ch;

		const matches = note.matchAll(pattern);
		if (!matches) return;

		for (const match of matches) {
			const end = match.index + match[0].length;
			if (match.index < cursorIndex && cursorIndex < end) {
				if (direction == "left") {
					// editor.setCursor(cursor.line, match.index);
				} else {
					// editor.setCursor(cursor.line, end);
				}
			}
		}
	}

	// Maps the line number to the index
	mapIndex(str: string): Bimap<number, number> {
		const bimap = new Bimap<number, number>();

		let lineNum = 0;
		bimap.setFor(0, 0);
		[...str].forEach((ch, i) => {
			if (ch == "\n") {
				bimap.setFor(lineNum + 1, i);
				lineNum++;
			}
		});

		return bimap;
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
