import { StringRange } from "..";
import type { Suggestion } from "..";

export class Suggestions {
	static readonly EMPTY = new Suggestions(StringRange.at(0), []);

	constructor(readonly range: StringRange, readonly suggestions: Suggestion[]) { }

	get isEmpty(): boolean { return this.suggestions.length === 0; }

	static merge(command: string, input: Suggestions[]): Suggestions {
		if (input.length === 0) {
			return Suggestions.EMPTY;
		} else if (input.length === 1) {
			return input[0];
		}
		const texts = new Set<Suggestion>();
		for (const suggestions of input) {
			suggestions.suggestions.forEach(s => texts.add(s));
		}
		return Suggestions.create(command, Array.from(texts));
	}

	static create(command: string, suggestions: Suggestion[]): Suggestions {
		if (suggestions.length === 0) {
			return Suggestions.EMPTY;
		}
		let start = Infinity;
		let end = -Infinity;
		for (const suggestion of suggestions) {
			start = Math.min(suggestion.range.start, start);
			end = Math.max(suggestion.range.end, end);
		}
		const range = new StringRange(start, end);
		const texts: Suggestion[] = [];
		for (const suggestion of suggestions) {
			texts.push(suggestion.expand(command, range));
		}
		return new Suggestions(range, texts.sort());
	}
}

