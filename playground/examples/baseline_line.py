from typing import Tuple

from pypie import Model, Tensor, float32


class Line(Model):
    def predict(x: float32, p: Tuple[float32, float32]) -> float32:
        return p[0] * x + p[1]

    def loss[n](ys_pred: Tensor[float32][[n]], ys: Tensor[float32][[n]]) -> float32:
        return ((ys_pred - ys) ** 2).sum(0)

    def update(p: float32, g: float32) -> float32:
        return p - (0.01 * g)


xs = Tensor([2.0, 1.0, 4.0, 3.0], float32)
ys = Tensor([1.8, 1.2, 4.2, 3.3], float32)

params = (0.0, 0.0)

params = Line.learn(xs, ys, params, 100)
w, b = params[0], params[1]

print(params)
assert 0.8 < float(w) < 1.2
assert -0.2 < float(b) < 0.2
