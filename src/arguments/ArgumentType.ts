import type { CommandContext, StringReader, Suggestions, SuggestionsBuilder } from "..";

export abstract class ArgumentType<T> {
	abstract parse(reader: StringReader): T

	abstract listSuggestions(context: CommandContext, builder: SuggestionsBuilder): Suggestions
}
