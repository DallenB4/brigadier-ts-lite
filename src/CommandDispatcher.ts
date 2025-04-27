import { CommandContextBuilder, RootCommandNode, StringReader, Suggestions, SuggestionsBuilder } from ".";
import type { CommandNode, LiteralArgumentBuilder } from ".";
import type { ParseResults } from "../types";

export class CommandDispatcher {
	private root: RootCommandNode = new RootCommandNode();

	register(command: LiteralArgumentBuilder) {
		this.root.addChild(command.build());
	}

	execute(parse: ParseResults | string): number {
		if (typeof parse === "string") {
			parse = this.parse(parse);
		}

		if (parse.reader.canRead()) {
			if (parse.errors.size === 1) {
				throw new Error(parse.errors.values().next().value as string);
			} else {
				throw new Error("An error occured!");
			}
		}

		let result = 0;
		const command = parse.reader.getString();
		const original = parse.context.build(command);

		if (original.command) {
			const r = original.command(original);
			result = (r || r === 0) ? r : 1;
		} else {
			throw new Error("Unknown command");
		}
		return result;
	}

	getCompletionSuggestions(parse: ParseResults, cursor?: number): Suggestions {
		if (cursor === undefined) {
			cursor = parse.reader.getTotalLength();
		}
		const context = parse.context;
		const nodeBeforeCursor = context.findSuggestionContext(cursor);
		const parent = nodeBeforeCursor.parent;
		const start = Math.min(nodeBeforeCursor.startPos, cursor);

		const fullInput = parse.reader.getString();
		const truncatedInput = fullInput.substring(0, cursor);
		const suggestions: Suggestions[] = [];
		for (const node of parent.children) {
			let suggestion = Suggestions.EMPTY;
			try {
				suggestion = node.listSuggestions(context.build(truncatedInput), new SuggestionsBuilder(truncatedInput, start));
			} catch (ignored) {
				console.log("???", ignored);
			}
			suggestions.push(suggestion);
		}
		return Suggestions.merge(fullInput, suggestions);
	}

	parse(command: string): ParseResults {
		const reader = new StringReader(command);
		const context = new CommandContextBuilder(this, this.root, reader.getCursor());
		return this.parseNodes(this.root, reader, context);
	}

	private parseNodes(node: CommandNode, originalReader: StringReader, contextSoFar: CommandContextBuilder) {
		const errors = new Map<CommandNode, string>;
		const potentials: ParseResults[] = [];
		const cursor = originalReader.getCursor();

		for (const child of node.getRelevantNodes(originalReader)) {
			const context = contextSoFar.copy();
			const reader = new StringReader(originalReader);

			try {
				child.parse(reader, context);
				if (reader.canRead() && reader.peek() !== " ") {
					throw new Error("");
				}
			} catch (e) {
				const { message } = e as Error;
				errors.set(child, message);
				reader.setCursor(cursor);
				continue;
			}

			context.withCommand(child.command);
			if (reader.canRead(2)) {
				reader.skip();
				potentials.push(this.parseNodes(child, reader, context));
			} else {
				potentials.push({ context, reader, errors: new Map() });
			}
		}
		if (potentials.length == 0) {
			potentials.push({ context: contextSoFar, reader: originalReader, errors });
		}
		return potentials[0];
	}
}
