import { CommandDispatcher, boolean, argument, literal, choice } from "../src";

describe("Completion", () => {
	test("boolean", () => {
		const dispatcher = new CommandDispatcher();

		dispatcher.register(literal("question").then(argument("arg1", boolean()).executes(c => c.get("arg1"))));
		const parse = dispatcher.parse("question ");
		const suggestion = dispatcher.getCompletionSuggestions(parse);
		console.log(suggestion.suggestions.map(c => c.tooltip))
		expect(suggestion.suggestions.length).toEqual(2)
	})

	test("choices", () => {
		const dispatcher = new CommandDispatcher();

		dispatcher.register(literal("choose")
			.then(argument("my_choice", choice(["thing1", "thing2", "something", "else"]))
				.executes(c => c.get("my_choice"))));
		const parse = dispatcher.parse("choose t");
		const suggestion = dispatcher.getCompletionSuggestions(parse);
		console.log(suggestion.suggestions.map(c => c.tooltip))
		expect(suggestion.suggestions.length).toEqual(2)
	})

});
