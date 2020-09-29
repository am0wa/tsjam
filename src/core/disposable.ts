/**
 * Often we need to explicitly cleanup in order to avoid memory leaks.
 */
export interface Disposable {
  dispose(): void;
}

export const isDisposable = (x: unknown): x is Disposable => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
  return !!x && typeof (x as any).dispose === 'function';
};

export namespace Disposable {
  export function dispose(x: unknown) {
    if (isDisposable(x)) {
      x.dispose();
    }
  }
}
