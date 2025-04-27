import type { Command } from "../../types";
import type { CommandNode } from "..";
import { RootCommandNode } from "..";

export abstract class ArgumentBuilder {
	private _command?: Command;
	get command(): Command | undefined { return this._command; }
	private _arguments: RootCommandNode = new RootCommandNode();
	get arguments(): RootCommandNode { return this._arguments; }

	then(argument: ArgumentBuilder): this {
		this._arguments.addChild(argument.build());
		return this;
	}

	executes(command: Command): this {
		this._command = command;
		return this;
	}

	abstract build(): CommandNode;
}
