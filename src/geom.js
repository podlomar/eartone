export class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  static fromAngleAndLength(angle, length) {
    return new Vector(
      Math.cos(angle) * length,
      Math.sin(angle) * length,
    );
  }

  magnitude() {
    return Map.sqrt(x**2 + y**2);
  }

  scale(factor) {
    return new Vector(this.x * factor, this.y * factor);
  }

  angle() {
    return Math.atan2(this.y, this.x) + Math.PI;
  }

  add(vec) {
    return new Vector(this.x + vec.x, this.y + vec.y);
  }
}