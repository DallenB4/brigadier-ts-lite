import { ArgumentBuilder, LiteralCommandNode } from "..";

export class LiteralArgumentBuilder extends ArgumentBuilder {
	readonly literal: string;

	constructor(name: string) {
		super();
		this.literal = name;
	}

	override build(): LiteralCommandNode {
		const result = new LiteralCommandNode(this.literal, this.command);
		for (const argument of this.arguments.children) {
			result.addChild(argument);
		}
		return result;
	}
}

export function literal(name: string) {
	return new LiteralArgumentBuilder(name);
}
