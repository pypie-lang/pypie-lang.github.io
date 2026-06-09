from pypie import Tensor, op, float32


@op
def main(x: Tensor[float32][[4]]) -> Tensor[float32][[]]:
    return x.mean()


x = Tensor([1.0, 2.0, 3.0, 4.0], float32)
print(main(x))
