import type { StringRange } from "..";

export class Suggestion {
	constructor(readonly range: StringRange, readonly text: string, private _tooltip?: string) { }

	get tooltip(): string { return this._tooltip ?? this.text; }

	apply(input: string): string {
		if (this.range.start == 0 && this.range.end === input.length) {
			return this.text;
		}
		let result = "";
		if (this.range.start > 0) {
			result += input.substring(0, this.range.start);
		}
		result += this.text;
		if (this.range.end < input.length) {
			result += input.substring(this.range.end);
		}
		return result;
	}

	expand(command: string, range: StringRange): Suggestion {
		if (range === this.range) {
			return this;
		}
		let result = "";
		if (range.start < this.range.start) {
			result += command.substring(range.start, this.range.start);
		}
		result += this.text;
		if (range.end > this.range.end) {
			result += command.substring(this.range.end, range.end);
		}
		return new Suggestion(range, result, this._tooltip);
	}
}

