import type { Command, ParsedArgument, ParsedCommandNode, SuggestionContext } from "../../types";
import type { CommandDispatcher, CommandNode } from "..";
import { CommandContext } from "..";
import { StringRange } from "..";

export class CommandContextBuilder {
	private range: StringRange;
	private command?: Command;
	private arguments: Map<string, ParsedArgument<unknown>> = new Map();
	private nodes: ParsedCommandNode[] = [];
	private _child?: CommandContextBuilder;
	get child(): CommandContextBuilder | undefined { return this._child; }

	constructor(private dispatcher: CommandDispatcher, private rootNode: CommandNode, start: number) {
		this.range = StringRange.at(start);
	}

	build(input: string): CommandContext {
		return new CommandContext(
			input,
			this.arguments,
			this.command,
			this.rootNode,
			this.nodes,
			this.range,
			this._child?.build(input)
		);
	}

	withCommand(command: Command | undefined): this {
		this.command = command;
		return this;
	}

	withNode(node: CommandNode, range: StringRange) {
		this.nodes.push({ node, range });
		this.range = StringRange.encompassing(this.range, range);
		return this;
	}

	withArgument<T>(name: string, argument: ParsedArgument<T>) {
		this.arguments.set(name, argument);
	}

	withChild(child: CommandContextBuilder) {
		this._child = child;
		return this;
	}

	copy(): CommandContextBuilder {
		const copy = new CommandContextBuilder(this.dispatcher, this.rootNode, this.range.start);
		copy.command = this.command;
		copy.range = this.range;
		copy.nodes.push(...this.nodes);
		copy._child = this._child;
		this.arguments.forEach((v, k) => {
			copy.arguments.set(k, v);
		});
		return copy;
	}

	findSuggestionContext(cursor: number): SuggestionContext {
		if (this.range.start <= cursor) {
			if (this.range.end < cursor) {
				if (this.child != null) {
					return this.child.findSuggestionContext(cursor);
				} else if (this.nodes.length > 0) {
					const last = this.nodes[this.nodes.length - 1];
					return { parent: last.node, startPos: last.range.end + 1 };
				} else {
					return { parent: this.rootNode, startPos: this.range.start };
				}
			} else {
				let prev = this.rootNode;
				for (const node of this.nodes) {
					const nodeRange = node.range;
					if (nodeRange.start <= cursor && cursor <= nodeRange.end) {
						return { parent: prev, startPos: nodeRange.start };
					}
					prev = node.node;
				}
				if (prev === null) {
					throw new Error("Can't find node before cursor");
				}
				return { parent: prev, startPos: this.range.start };
			}
		}
		throw new Error("Can't find node before cursor");
	}
}
