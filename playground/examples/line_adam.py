from dataclasses import dataclass

from pypie import Model, Tensor, op, sqrt


@dataclass
class Params[T]:
    w: T
    b: T


@op
def smooth(decay: float, avg: float, g: float) -> float:
    return decay * avg + (1.0 - decay) * g


class LineAdam[T](Model):
    def predict(x: T, p: Params[T]) -> T:
        return p.w * x + p.b

    def loss[n](ys_pred: Tensor[T][[n]], ys: Tensor[T][[n]]) -> T:
        return ((ys_pred - ys) ** 2).sum(0)

    def inflate(p: T) -> tuple[T, T, T]:
        return (p, 0, 0)

    def deflate(s: tuple[T, T, T]) -> T:
        return s[0]

    def update(s: tuple[T, T, T], g: T) -> tuple[T, T, T]:
        m = (0.9 * s[1]) + (0.1 * g)
        v = (0.999 * s[2]) + (0.01 * (g ** 2))
        return (s[0] - (0.05 * (m / (sqrt(v) + 1e-8))), m, v)


xs = Tensor([2.0, 1.0, 4.0, 3.0])
ys = Tensor([1.8, 1.2, 4.2, 3.3])

params = Params(0.0, 0.0)
params = LineAdam.learn(xs, ys, params, 5, batch_size=4)

print(params)
assert 0.2 < float(params.w) < 0.8
assert 0.1 < float(params.b) < 0.5
