import type { CommandContextBuilder, CommandNode, StringReader } from "../src";

export type ParseResults = {
	context: CommandContextBuilder,
	reader: StringReader,
	errors: Map<CommandNode, string>
}
