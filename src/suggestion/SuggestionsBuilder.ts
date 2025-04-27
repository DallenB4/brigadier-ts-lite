import { StringRange, Suggestion, Suggestions } from "..";

export class SuggestionsBuilder {
	readonly remaining: string;
	result: Suggestion[];

	constructor(readonly input: string, readonly start: number) {
		this.remaining = input.substring(start);
		this.result = [];
	}

	build(): Suggestions {
		return Suggestions.create(this.input, this.result);
	}

	suggest(text: string, tooltip?: string): SuggestionsBuilder {
		// if (text === this.remaining) {
		// 	return this;
		// }
		this.result.push(new Suggestion(new StringRange(this.start, this.input.length), text, tooltip));
		return this;
	}

	add(other: SuggestionsBuilder): SuggestionsBuilder {
		this.result.concat(other.result);
		return this;
	}

	createOffset(start: number): SuggestionsBuilder {
		return new SuggestionsBuilder(this.input, start);
	}

	restart(): SuggestionsBuilder {
		return new SuggestionsBuilder(this.input, this.start);
	}
}
