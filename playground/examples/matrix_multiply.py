from pypie import Tensor, op, float32


@op
def main(x: Tensor[float32][[2, 2]], y: Tensor[float32][[2, 2]]) -> Tensor[float32][[2, 2]]:
    return x @ y


x = Tensor([[1.0, 2.0], [3.0, 4.0]], float32)
y = Tensor([[5.0, 6.0], [7.0, 8.0]], float32)
print(main(x, y))
