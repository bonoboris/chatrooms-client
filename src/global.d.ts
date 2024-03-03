export {};

declare global {
  /** The first argument of a function */
  type FirstArg<T> = T extends (arg0: infer U, ...args: readonly unknown[]) => void ? U : never;
  /** Reveal the type as an object */
  type Reveal<T> = { [k in keyof T]: T[k] };
}
