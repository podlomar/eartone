export const mod = (a, n) => (a % n + n) % n;
export const angleDiff = (a, b) => {
  return mod(b - a + Math.PI, Math.PI*2) - Math.PI
};