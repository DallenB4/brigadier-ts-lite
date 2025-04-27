import { CommandNode, Suggestions } from "..";

export class RootCommandNode extends CommandNode {
	parse(): void { }

	constructor() {
		super(undefined);
	}

	override get name(): string { return ''; };

	listSuggestions(): Suggestions {
		return Suggestions.EMPTY;
	}
}
