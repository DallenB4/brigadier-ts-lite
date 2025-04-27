export class StringRange {
	constructor(readonly start: number, readonly end: number) { }

	static at(pos: number): StringRange {
		return new StringRange(pos, pos);
	}

	static encompassing(a: StringRange, b: StringRange): StringRange {
		const start = Math.min(a.start, b.start);
		const end = Math.max(a.end, b.end);
		return new StringRange(start, end);
	}

	get isEmpty(): boolean { return this.start === this.end; }

	get length(): number { return Math.abs(this.end - this.start); }
}
