import type { CommandContext, StringReader, SuggestionsBuilder } from "..";
import { NumberArgumentType } from "./NumberArgumentType";
import { Suggestions } from "..";

class IntegerArgumentType extends NumberArgumentType {
	constructor(minimum = -2147483648, maximum = 2147483647) {
		super(minimum, maximum);
	}

	readNumber(reader: StringReader): number {
		return reader.readInt();
	}

	override listSuggestions(_: CommandContext, builder: SuggestionsBuilder): Suggestions {
		const value = Number(builder.remaining);
		if (isNaN(value) || !Number.isInteger(value) || builder.remaining.length === 0)
			return Suggestions.EMPTY;
		return builder.suggest("<number>", builder.remaining).build();
	}

}

export function integer(minimum = -2147483648, maximum = 2147483647) {
	return new IntegerArgumentType(minimum, maximum);
}
