import type { CommandNode } from "../src";

export type SuggestionContext = {
	parent: CommandNode
	startPos: number
}
