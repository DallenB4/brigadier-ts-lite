# Brigadier-ts-lite
Slimmed-down version of [Misode/brigadier-ts](https://github.com/misode/brigadier-ts)

## Installation
```
npm install dallenb4/brigadier-ts-lite
```

## Features

- Now with 90% less getters
- Sub-commands
- String, Integer, Float, and Bool argument types
- New Enum argument type

### Changes

Command suggestions are different, in order to facilitate more dyncamic autocomplete

### Not Supported

Some more advanced functions of Brigadier are not included.

- Command Sources
- Forking
- Modifiers

## Usage

#### Example
```typescript
import {
    CommandDispatcher,
    literal,
    argument,
    float
} from "brigadier-ts-lite";

const dispatcher = new CommandDispatcher();

dispatcher.register(literal("add")
    .then(argument("arg1", float())
        .then(argument("arg2", float())
            .executes(c => {
                const arg1 = c.get<number>('arg1') || 0;
                const arg2 = c.get<number>('arg2') || 0;
                console.log(`Sum: ${arg1 + arg2}`);
            })
        )
    )
);
```

#### Example using enum argument and suggestions
```ts
import {
    CommandDispatcher,
    IntegerArgumentType,
    literal,
    argument
} from "brigadier-ts";

const dispatcher = new CommandDispatcher();

dispatcher.register(literal("choose")
    .then(argument("my_choice", choice(["thing1", "thing2", "something", "else"]))
        .executes(c => c.get("my_choice"))));

const parse = dispatcher.parse("choose thing");
const suggestion = dispatcher.getCompletionSuggestions(parse);

console.log(suggestion.suggestions.map(c => c.tooltip).join('|')) // thing1 | thing2
```
