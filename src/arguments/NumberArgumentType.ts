import { ArgumentType } from "..";
import type { StringReader } from "..";

export abstract class NumberArgumentType<N extends number | bigint = number> extends ArgumentType<N> {
	private minimum: N;
	private maximum: N;

	constructor(minimum: N, maximum: N) {
		super();
		this.minimum = minimum;
		this.maximum = maximum;
	}

	getMinimum(): N {
		return this.minimum;
	}

	getMaximum(): N {
		return this.maximum;
	}

	parse(reader: StringReader): N {
		const start = reader.getCursor();
		const result = this.readNumber(reader);
		if (result < this.minimum) {
			reader.setCursor(start);
			throw new Error("Too small!");
		} else if (result > this.maximum) {
			reader.setCursor(start);
			throw new Error("Too large!");
		}
		return result;
	}

	abstract readNumber(reader: StringReader): N;
}
