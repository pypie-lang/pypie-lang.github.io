(() => {
    type Side = "left" | "right";

    type LearnDialogMessage = {
        side: Side;
        speaker: string;
        text: string;
    };

    type LearnPageConfig = {
        id: string;
        dialog: LearnDialogMessage[];
        notes?: string;
    };

    type LearnRender = (config: LearnPageConfig) => void;

    type LearnWindow = Window & {
        PYPIE_LEARN_RENDER?: LearnRender;
    };

    const render = (window as LearnWindow).PYPIE_LEARN_RENDER;
    if (typeof render !== "function") {
        return;
    }

    const message = (speaker: "D" | "W", text: string): LearnDialogMessage => ({
        side: speaker === "W" ? "right" : "left",
        speaker,
        text,
    });

    render({
        id: "ops-on-tensors",
        dialog: [
            message(
                "D",
                "Let's run programs with `Tensor`s.\n" +
                "Quick warm-up: what is `1 + 1`?"
            ),
            message("W", "`2`. But are those even `Tensor`s?"),
            message(
                "D",
                "Yes, `1` has type `Tensor[int][[]]`.\n" +
                "Try this next: `Tensor([1]) + Tensor([1])`."
            ),
            message(
                "W",
                "Hmm... if we break them into smaller tensors, " +
                "then at the matching position, we have `1 + 1` again--a problem we've already solved."
            ),
            message(
                "D",
                "Great instinct. Indeed, we add the matching positions."
            ),
            message(
                "W",
                "Then it is `Tensor([2])`, right?\n" +
                "Likewise, `Tensor([1, 2, 3]) + Tensor([5, 7, 9])` gives `Tensor([6, 9, 12])`."
            ),
            message(
                "D",
                "What about `Tensor([[1, 2, 3], [3, 2, 1]]) + Tensor([5, 7, 9])`?"
            ),
            message(
                "W",
                "Wait, their types are different: " +
                "`Tensor[int][[2, 3]]` and `Tensor[int][[3]]`.\n" +
                "Can we add `Tensor`s with different types?"
            ),
            message(
                "D",
                "For this one, yes. A `Tensor[int][[2, 3]]` contains two `Tensor[int][[3]]`s.\n" +
                "So we run `+` twice. Each still adds matching positions."
            ),
            message(
                "W",
                "Right.\n" +
                "First: `Tensor([1, 2, 3]) + Tensor([5, 7, 9])`.\n" +
                "Second: `Tensor([3, 2, 1]) + Tensor([5, 7, 9])`.\n" +
                "Then we combine the results as `Tensor([[6, 9, 12], [8, 9, 10]])`?"
            ),
            message("D", "What is the result type?"),
            message(
                "W",
                "The result is `Tensor[int][[2, 3]]`, the same as the larger input shape.\n" +
                "It's a nice trick to split the larger `Tensor`!"
            ),
            message("D", "The trick is called rank polymorphism."),
            message("W", "An intimidating name!"),
            message(
                "D",
                "It's actually warmer and fuzzier than it looks. Here, !!rank!! is just the length of the shape.\n" +
                "`Tensor[int][[3]]` has rank `1`, and `Tensor[int][[2, 3]]` has rank `2`."
            ),
            message("W", "Then `42` has type `Tensor[int][[]]`, so rank `0`?"),
            message(
                "D",
                "Yes.\n" +
                "When we design a function, we define its expected types for inputs and result.\n" +
                "Rank polymorphism lets us apply that function to higher-rank inputs when they are compatible, and it wraps the result type accordingly."
            ),
            message(
                "W",
                "So one function works across different input ranks.\n" +
                "Is `+` a !!function!!?"
            ),
            message(
                "D",
                "`+` is a function. Just like\n" +
                "`5` has type `Tensor[int][[]]`,\n" +
                "`+` has type `(x: Tensor[int][[]], y: Tensor[int][[]]) -> Tensor[int][[]]`."
            ),
            message(
                "W",
                "This function type suggests three things:\n" +
                "`+` expects two inputs, `x` and `y`.\n" +
                "`x` is `Tensor[int][[]]`, and so is `y`.\n" +
                "The result is also a `Tensor[int][[]]`."
            ),
            message(
                "D",
                "Now imagine applying `+` with `1` as `x` and `1` as `y`."
            ),
            message(
                "W",
                "`1` is `Tensor[int][[]]`, so both inputs match exactly.\n" +
                "Therefore `1 + 1` has result type `Tensor[int][[]]`, which is the type of `2`."
            ),
            message(
                "D",
                "Next: `Tensor([[1, 2, 3], [3, 2, 1]]) + Tensor([5, 7, 9])`. " +
                "In the earlier exercise, we virtually ran the program and found `Tensor[int][[2, 3]]` by looking at the result value.\n" +
                "Now we derive the result type, without running the program.\n" +
                "Let's start by validating the inputs."
            ),
            message(
                "W",
                "Here, `x` has type `Tensor[int][[2, 3]]` and `y` has type `Tensor[int][[3]]`.\n" +
                "Neither exactly matches the expected `Tensor[int][[]]`.\n" +
                "But they must be compatible, since we added them just now!"
            ),
            message("D", "We need a rule for the compatibility between `List[int]`s."),
            message("W", "Let's see it!"),
            message(
                "D",
                "Two `List[int]`s are !!compatible!!, if we line them up from the right and find a " +
                "!!suffix!! in the longer one that matches the shorter.* " +
                "The remaining part in the longer list is called the !!prefix!!.\n" +
                "Find the suffix and prefix for `x` and `y`."
            ),
            message(
                "W",
                "For `x`, compare `[2, 3]` with `[]`: suffix `[]`, prefix `[2, 3]`.\n" +
                "For `y`, compare `[3]` with `[]`: suffix `[]`, prefix `[3]`.\n" +
                "That means: each given input is compatible with its expected type!"
            ),
            message("D", "Great. Next, validate compatibility between the two prefixes."),
            message(
                "W",
                "Does compatibility also work on prefixes?"
            ),
            message(
                "D",
                "Yes. Compatibility applies to `List[int]`s. Prefixes are `List[int]`s too."
            ),
            message(
                "W",
                "So we compare `[2, 3]` with `[3]`.\n" +
                "The suffix is `[3]` and the prefix is `[2]`.\n" +
                "That means the prefixes from the inputs are also compatible."
            ),
            message(
                "D",
                "Good progress! So far:\n" +
                "for each input, the given type is compatible with the expected type;\n" +
                "the two prefixes from the inputs are compatible with one another.\n" +
                "So `Tensor[int][[2, 3]]` and `Tensor[int][[3]]` are valid inputs for `x` and `y` in `+`."
            ),
            message("W", "Nice. What's our next step?"),
            message(
                "D",
                "Now we wrap the result type. Under rank polymorphism, we repeatedly apply `+` to generate many `Tensor[int][[]]`s.\n" +
                "The number of repetitions depends on the longer prefix."
            ),
            message(
                "W",
                "Got it. The longer prefix is `[2, 3]`, so we wrap `Tensor[int][[]]` with `[2, 3]`. "+
                "That makes `Tensor[Tensor[int][[]]][[2, 3]]`, which simplifies to `Tensor[int][[2, 3]]`.\n" +
                "Exactly the same as running the program!"
            ),
            message(
                "D",
                "Great work!\n" +
                "Try a few failing examples too: cases where a given type is incompatible with an expected type, or where the prefixes are incompatible.\n" +
                "It helps to internalize this trick."
            ),
            message(
                "W",
                "Will do."
                ),
            message(
                "D",
                "Let's recap !!rank polymorphism!!:\n" +
                "for each input, validate compatibility between the given and expected types, find the prefixes;\n" +
                "validate compatibility between those prefixes;\n" +
                "wrap the result type with the longer prefix.\n" +
                "This process applies to all functions."
            ),
            message("W", "Are there other functions besides `+`?"),
            message(
                "D",
                "Yes, you can define as many as you need. " +
                "We'll cover that in the next chapter.\n" +
                "Time for a break!"
            ),
            message("W", "Okay, ciao!"),
        ],
        notes: "* We match the `int`s in two `List[int]`s in matching positions, from the right end. Two `int`s  match, if they are identical, or if either of them is `1`.",
    });
})();
