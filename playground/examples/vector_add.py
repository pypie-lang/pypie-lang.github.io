from pypie import Tensor, op, float32


@op
def main[T](x: Tensor[T][[2]], y: Tensor[T][[2]]) -> Tensor[T][[2]]:
    return x + y


x = Tensor([1.0, 2.0], float32)
y = Tensor([3.0, 4.0], float32)
print(main(x, y))
