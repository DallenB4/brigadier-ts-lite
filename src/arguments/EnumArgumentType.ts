import type { CommandContext, StringReader, Suggestions, SuggestionsBuilder } from "..";
import { ArgumentType } from "..";

export class EnumArgumentType extends ArgumentType<string> {
	constructor(private items: string[]) { super(); }

	parse(reader: StringReader): string {
		for (const item of this.items) {
			const text = reader.getRemaining();
			if (text.startsWith(item)) {
				reader.setCursor(reader.getCursor() + text.length);
				return text;
			}
		}
		throw new Error("An error occured!");
	}

	override listSuggestions(_: CommandContext, builder: SuggestionsBuilder): Suggestions {
		for (const item of this.items) {
			if (item.startsWith(builder.remaining.toLowerCase()))
				builder.suggest(item);
		}
		return builder.build();
	}
}

export function choice(items: string[]): EnumArgumentType {
	return new EnumArgumentType(items);
}
