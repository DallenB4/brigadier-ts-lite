import type { CommandContext, StringReader, SuggestionsBuilder } from "..";
import { NumberArgumentType } from "./NumberArgumentType";
import { Suggestions } from "..";

class FloatArgumentType extends NumberArgumentType {
	constructor(minimum = -Infinity, maximum = Infinity) {
		super(minimum, maximum);
	}

	readNumber(reader: StringReader): number {
		return reader.readFloat();
	}

	override listSuggestions(_: CommandContext, builder: SuggestionsBuilder): Suggestions {
		const value = Number(builder.remaining);
		if (isNaN(value) || builder.remaining.length === 0)
			return Suggestions.EMPTY;
		return builder.suggest("<number>", builder.remaining).build();
	}
}

export function float(minimum = -Infinity, maximum = Infinity) {
	return new FloatArgumentType(minimum, maximum);
}
