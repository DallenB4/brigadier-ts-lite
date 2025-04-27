import type { CommandContext, StringReader, Suggestions, SuggestionsBuilder } from "..";
import { ArgumentType } from "..";

type StringType = "single_word" | "quotable_phrase" | "greedy_phrase";

export class StringArgumentType extends ArgumentType<string> {
	constructor(readonly type: StringType) { super(); }

	parse(reader: StringReader): string {
		switch (this.type) {
			case "greedy_phrase": {
				const text = reader.getRemaining();
				reader.setCursor(reader.getTotalLength());
				return text;
			}
			case "single_word":
				return reader.readUnquotedString();
			default:
				return reader.readString();
		}
	}

	override listSuggestions(_: CommandContext, builder: SuggestionsBuilder): Suggestions {
		builder.suggest(this.type, builder.remaining);
		return builder.build();
	}
}

export function string(type: StringType) {
	return new StringArgumentType(type);
}
