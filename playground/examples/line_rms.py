from dataclasses import dataclass

from pypie import Model, Tensor, op, rand

@dataclass
class Params[T]:
    w: T
    b: T

@op
def smooth[T](decay: T, avg: T, g: T) -> T:
    return decay * avg + (1.0 - decay) * g

class LineRMS[T](Model):
    def predict(x: T, p: Params[T]) -> T:
        return p.w * x + p.b

    def loss[n](ys_pred: Tensor[T][[n]], ys: Tensor[T][[n]]) -> T:
        return ((ys_pred - ys) ** 2).sum(0)

    def inflate(p: T) -> tuple[T, T]:
        return (p, 0)

    def deflate(s: tuple[T, T]) -> T:
        return s[0]

    def update(s: tuple[T, T], g: T) -> tuple[T, T]:
        avg = smooth(0.9, s[1], g ** 2)
        alpha = 0.01 / (1e-8 + (avg ** 0.5))
        return (s[0] - alpha * g, avg)

xs = rand([1000], -10.0, 10.0)
ys = rand([1000], -2.0, 2.0) + xs * 2.0 + 0.5
params = Params(0.0, 0.0)

params = LineRMS.learn(xs, ys, params, 100)
print(params)