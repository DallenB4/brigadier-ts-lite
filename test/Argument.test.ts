import { CommandContext, CommandDispatcher, boolean, argument, float, literal, string, choice } from "../src";

describe("Arguments", () => {
	test("string: greedy_phrase", () => {
		const dispatcher = new CommandDispatcher();

		dispatcher.register(literal("say").then(argument("words", string("greedy_phrase")).executes(c => c.get("words"))))
		const result = dispatcher.execute("say abcdefg hij lmn0p!")
		console.log(result)
		expect(result).toEqual("abcdefg hij lmn0p!")
	})

	test("string: quotable_phrase", () => {
		const dispatcher = new CommandDispatcher();

		dispatcher.register(literal("say").then(argument("words", string("quotable_phrase")).executes(c => c.get("words"))))
		const result = dispatcher.execute("say 'abcdefg'")
		console.log(result)
		expect(result).toEqual("abcdefg")
	})

	test("string: single_word", () => {
		const dispatcher = new CommandDispatcher();

		dispatcher.register(literal("say").then(argument("words", string("single_word")).executes(c => c.get("words"))))
		const result = dispatcher.execute("say word")
		console.log(result)
		expect(result).toEqual("word")
	})
});
