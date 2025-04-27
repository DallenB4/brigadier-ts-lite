import type { CommandContext } from "../src";

export type Command = (c: CommandContext) => number | void
