import type { Command, ParsedArgument, ParsedCommandNode } from "../../types";
import type { CommandNode, StringRange } from "..";

export class CommandContext {
	arguments: Map<string, ParsedArgument<unknown>>;

	constructor(readonly input: string,
		parsedArguments: Map<string, ParsedArgument<unknown>>,
		readonly command: Command | undefined,
		readonly rootNode: CommandNode,
		readonly nodes: ParsedCommandNode[],
		readonly range: StringRange,
		readonly child: CommandContext | undefined) {
		this.arguments = parsedArguments;
	}

	get<T>(name: string): T | undefined {
		return this.arguments.get(name)?.result as T | undefined;
	}
}
