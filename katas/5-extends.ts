// Conditional Types: https://www.typescriptlang.org/docs/handbook/2/conditional-types.html

type MyLength<T extends any[], Accumulator extends any[] = []> = unknown;

const correctLength: MyLength<[1, 2, 3, 4]> = 4;
// @ts-expect-error
const incorrectLength: MyLength<[1, 2, 3, 4]> = 5;

