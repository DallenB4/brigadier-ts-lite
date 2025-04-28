import type { CommandContext, StringReader, Suggestions, SuggestionsBuilder } from "..";
import { NumberArgumentType } from "./NumberArgumentType";

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
			return builder.suggest("<number>").build();
		if (value < this.minimum) {
			throw new Error("Too small!");
		} else if (value > this.maximum) {
			throw new Error("Too large!");
		}
		return builder.suggest("<number>", builder.remaining).build();
	}

}

export function integer(minimum = -2147483648, maximum = 2147483647) {
	return new IntegerArgumentType(minimum, maximum);
}
