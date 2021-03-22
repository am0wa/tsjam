export namespace math {
  export const closest = (goal: number, among: readonly number[]): number => {
    return among.reduce(
      (prev, curr) => (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev),
      0,
    );
  }
}