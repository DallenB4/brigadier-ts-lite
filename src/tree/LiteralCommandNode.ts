import type { CommandContext, CommandContextBuilder, StringReader, SuggestionsBuilder } from "..";
import { CommandNode, StringRange, Suggestions } from "..";
import type { Command } from "../../types";

export class LiteralCommandNode extends CommandNode {
	get name(): string { return this.literal; }

	constructor(private literal: string, command?: Command) {
		super(command);
	}

	parse(reader: StringReader, context: CommandContextBuilder): void {
		const start = reader.getCursor();
		const end = this.parseInternal(reader);
		if (end > -1) {
			context.withNode(this, new StringRange(start, end));
			return;
		}
		throw new Error("");
	}

	private parseInternal(reader: StringReader): number {
		const start = reader.getCursor();
		if (reader.canRead(this.literal.length)) {
			const end = start + this.literal.length;
			if (reader.getString().slice(start, this.literal.length) === this.literal) {
				reader.setCursor(end);
				if (!reader.canRead() || reader.peek() == " ") {
					return end;
				} else {
					reader.setCursor(start);
				}
			}
		}
		return -1;
	}

	listSuggestions(_: CommandContext, builder: SuggestionsBuilder): Suggestions {
		if (this.literal.toLowerCase().startsWith(builder.remaining.toLowerCase())) {
			return builder.suggest(this.literal).build();
		} else {
			return Suggestions.EMPTY;
		}
	}
}
