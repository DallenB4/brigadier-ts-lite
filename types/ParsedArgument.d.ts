import type { StringRange } from "../src";

export type ParsedArgument<T> = {
	range: StringRange
	result: T
}
