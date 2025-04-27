import type { CommandContext, StringReader, Suggestions, SuggestionsBuilder } from "..";
import { ArgumentType } from "..";

export class BoolArgumentType extends ArgumentType<boolean> {

	parse(reader: StringReader): boolean {
		return reader.readBoolean();
	}

	override listSuggestions(_: CommandContext, builder: SuggestionsBuilder): Suggestions {
		// Both are if statements because empty strings should suggest both true and false
		if ("true".startsWith(builder.remaining.toLowerCase())) {
			builder.suggest("true");
		}
		if ("false".startsWith(builder.remaining.toLowerCase())) {
			builder.suggest("false");
		}
		return builder.build();
	}
}

export function boolean(): BoolArgumentType {
	return new BoolArgumentType();
}
