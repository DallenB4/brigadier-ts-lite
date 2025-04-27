import type { ArgumentType, CommandContext, CommandContextBuilder, StringReader, Suggestions, SuggestionsBuilder } from "..";
import type { Command, ParsedArgument } from "../../types";
import { CommandNode, StringRange } from "..";

export class ArgumentCommandNode<T> extends CommandNode {
	readonly type: ArgumentType<T>;
	private _name: string;
	get name(): string { return this._name; }

	constructor(name: string, type: ArgumentType<T>, command?: Command) {
		super(command);
		this._name = name;
		this.type = type;
	}

	parse(reader: StringReader, context: CommandContextBuilder): void {
		const start = reader.getCursor();
		const result = this.type.parse(reader);
		const parsed: ParsedArgument<T> = { range: new StringRange(start, reader.getCursor()), result };
		context.withArgument(this.name, parsed);
		context.withNode(this, parsed.range);
	}

	override listSuggestions(context: CommandContext, builder: SuggestionsBuilder): Suggestions {
		let suggestions = this.type.listSuggestions(context, builder);
		if (suggestions.isEmpty)
			suggestions = builder.suggest(this.name).build();
		return suggestions;
	}
}
