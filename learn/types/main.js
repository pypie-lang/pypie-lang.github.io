(() => {
    const render = window.PYPIE_LEARN_RENDER;
    if (typeof render !== "function") {
        return;
    }
    const message = (speaker, text) => ({
        side: speaker === "W" ? "right" : "left",
        speaker,
        text,
    });
    render({
        id: "Types",
        dialog: [
            message("D", "Alrighty, let's get started."),
            message("W", "Can't wait!"),
            message("D", "What is `5`?"),
            message("W", "Is `5` an !!`int`!!?"),
            message("D", "Excellent! Do you know other `int`s?"),
            message("W", "Hmm... `0` and `-42`?"),
            message("D", "They are `int`s too."),
            message("W", "What about `-42.42`?"),
            message("D", "`-42.42` is a !!`float`!!, different from `int`."),
            message("W", "How?"),
            message("D", "On machines, `42` and `42.42` are stored differently. They also take different commands.\n" +
                "`int` and `float` are !!type!!s. A type describes the behavior of a set of values."),
            message("W", "Interesting. Are there values of other types?"),
            message("D", "Here's one `[1, 2, 3]`."),
            message("W", "It groups three `int`s together! What do we call it?"),
            message("D", "We call `[1, 2, 3]` a `List[int]`."),
            message("W", "So !!`List[t]`!! is a type, as long as `t` is a type.\nThen there must be a type called `List[List[int]]`, right?"),
            message("D", "Yes, `List`s can be nested, such as `[[1, 2, 3], [4, 5, 6]]`."),
            message("W", "What about `[[1, 2, 3], [4, 5]]`?"),
            message("D", "That's also a `List[List[int]]`, since its first element is a `List[int]`..."),
            message("W", "... because all elements inside that element are `int`s.\n" +
                "Then its second element is also a `List[int]`, since all elements there are `int`s.\n" +
                "Phew... that's a lot of reasoning."),
            message("D", "Fortunately, machines may do that reasoning for us, rigorously and efficiently.\n" +
                "Now, there is a stricter way to group things."),
            message("W", "Go for it!"),
            message("D", "```Tensor([[1, 2, 3], [4, 5, 6]])```"),
            message("W", "It merely wraps this `Tensor` thing around the list. How is it different?"),
            message("D", "It has the type `Tensor[int][[2, 3]]`. A `Tensor` knows two things about its elements: their type and their shape."),
            message("W", "`[2, 3]` is a `List[int]` that describes the !!shape!! of `Tensor([[1, 2, 3], [4, 5, 6]])`, since the outer layer contains two `List[int]`s and each inner layer contains three `int`s?"),
            message("D", "Not quite, but close.\n" +
                "`Tensor([[1, 2, 3], [4, 5, 6]])` is the prettier way to write `Tensor([Tensor([1, 2, 3]), Tensor([4, 5, 6])])`.\n" +
                "Its contains two elements; both are `Tensor[int][[3]]`s.\n" +
                "Each element also contains three elements; all are `Tensor[int][[]]`s."),
            message("W", "I see.\n" +
                "So, `int` and `Tensor[int][[]]` are the same type.\n" +
                "`Tensor[int][[2, 3]]` and `Tensor[Tensor[int][[3]]][[2]]` are also the same type."),
            message("D", "Convetionally, we have a name for values of `int` or `float`: !!scalar!!s."),
            message("W", "Can we make `[[1, 2, 3], [4, 5]]` a `Tensor`?"),
            message("D", "Good question. What's its shape?"),
            message("W", "Hmm... I don't know how to describe its shape."),
            message("D", "Neither do I. We cannot make `[[1, 2, 3], [4, 5]]` a `Tensor`, since it does not have a shape!"),
            message("W", "So, `Tensor`s are special because of shapes!"),
            message("D", "Yes. !!`Tensor[t][s]`!! is a type as long as `t` is a type and `s` is a `List[int]`.\n" +
                "With shapes, `Tensor`s describe their values more accurately than `List`s do.\n" +
                "This precision enables many cool things."),
            message("W", "Such as?"),
            message("D", "Running programs in parallel, efficiently.\n" +
                "Since all elements in a tensor share the same shape, it is easier to dispatch commands on all of them all together."),
            message("W", "Sounds like a cool thing! Let's see an example!"),
            message("D", "We will, in the next chapter. Now it's time to take a break."),
            message("W", "See you there!"),
        ],
    });
})();
