import { ArgumentCommandNode, LiteralCommandNode } from "..";
import type { CommandContext, CommandContextBuilder, StringReader, Suggestions, SuggestionsBuilder } from "..";
import type { Command } from "../../types";

export abstract class CommandNode {
	private _children: Map<string, CommandNode> = new Map();
	private literals: Map<string, LiteralCommandNode> = new Map();
	private arguments: Map<string, ArgumentCommandNode<unknown>> = new Map();
	get children(): CommandNode[] { return Array.from(this._children.values()); }
	private _command?: Command;
	get command(): Command | undefined { return this._command; }
	abstract get name(): string;

	constructor(command: Command | undefined) {
		this._command = command;
	}

	abstract parse(reader: StringReader, context: CommandContextBuilder): void;

	abstract listSuggestions(context: CommandContext, builder: SuggestionsBuilder): Suggestions;

	getRelevantNodes(input: StringReader): CommandNode[] {
		if (this.literals.size > 0) {
			const cursor = input.getCursor();
			while (input.canRead() && input.peek() != " ") {
				input.skip();
			}
			const text = input.getString().substring(cursor, input.getCursor());
			input.setCursor(cursor);
			const literal = this.literals.get(text);
			if (literal != null) {
				return [literal];
			}
		}
		return Array.from(this.arguments.values());
	}

	addChild(node: CommandNode) {
		const child = this._children.get(node.name);
		if (child) {
			if (child.command) {
				child._command = node._command;
			}
			node._children.forEach((grandChild) => {
				child.addChild(grandChild);
			});
		} else {
			this._children.set(node.name, node);
			if (node instanceof LiteralCommandNode)
				this.literals.set(node.name, node);
			else if (node instanceof ArgumentCommandNode)
				this.arguments.set(node.name, node);
		}
	}
}
