import { Editor, Plugin } from "obsidian";

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: "default",
};

type Direction = "left" | "right";

const pattern = /```([^]*?)```|`([^\n`]*)`|\$\$([^]*?)\$\$|\$(.*?)\$/g;

// Maps the line number to the index
function mapIndex(str: string): Map<number, number> {
	const lineIndexMap = new Map<number, number>();
	lineIndexMap.set(0, 0);

	let lineNum = 0;
	[...str].forEach((ch, i) => {
		if (ch == "\n") {
			lineIndexMap.set(lineNum + 1, i + 1);
			lineNum++;
		}
	});

	lineIndexMap.set(lineIndexMap.size, str.length);
	return lineIndexMap;
}

function findFloorIndex(arr: number[], target: number): number | undefined {
	let left = 0;
	let right = arr.length - 1;

	let result;

	while (left <= right) {
		const mid = ~~((left + right) / 2);

		if (arr[mid] <= target) {
			result = mid;
			left = mid + 1;
		} else {
			right = mid - 1;
		}
	}

	return result;
}

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

		const indexMap = mapIndex(note);

		const cursorIndex = indexMap.get(cursor.line)! + cursor.ch;

		const matches = note.matchAll(pattern);
		if (!matches) return;

		for (const match of matches) {
			const end = match.index + match[0].length;
			if (match.index <= cursorIndex && cursorIndex <= end) {
				const lineIndices = [...indexMap.values()];
				if (direction == "left") {
					const line = findFloorIndex(lineIndices, match.index)!;
					editor.setCursor(line, match.index - indexMap.get(line)!);
				} else {
					const line = findFloorIndex(lineIndices, end)!;
					editor.setCursor(line, end - indexMap.get(line)!);
				}
				break;
			}
		}
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
