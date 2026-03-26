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
        id: "prelude",
        dialog: [
            message("W", "This tutorial shows how to write machine learning code in a productive and enjoyable way, " +
                "through the journey of building three architectures: a linear regression model, a CNN, and a transformer.\n\n" +
                "We do this using types and abstraction, which offload low-level mechanics to PyPie. " +
                "Types give clarity to our programs and catch bugs before they run. " +
                "Abstraction hides tedious details in recurring patterns.\n\n" +
                "It requires little background to learn these principles: " +
                "high school math is enough; first-time programmers are welcome. " +
                "We only ask for curiosity and hands-on practice. " +
                "Each chapter is a dialog between a teacher and a student, filled with questions, answers, and code. " +
                "To get the most out of it, type and run the programs in PyPie.\n\n" +
                "Our teacher is waiting. Shall we begin?"),
        ],
    });
})();
