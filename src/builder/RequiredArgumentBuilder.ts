import { ArgumentBuilder, ArgumentCommandNode } from "..";
import type { ArgumentType, CommandNode } from "..";

export class RequiredArgumentBuilder extends ArgumentBuilder {
	constructor(private name: string, private type: ArgumentType<unknown>) { super(); }

	build(): CommandNode {
		const result = new ArgumentCommandNode(this.name, this.type, this.command);
		for (const argument of this.arguments.children) {
			result.addChild(argument);
		}
		return result;
	}
}

export function argument<T>(name: string, type: ArgumentType<T>) {
	return new RequiredArgumentBuilder(name, type);
}
