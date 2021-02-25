// https://www.typescriptlang.org/docs/handbook/utility-types.html Parameters, typeof, ReturnType

type AnyFunction = (...args: any[]) => any;
const createSpyFunctionPreservingTypes = <T extends AnyFunction>(fn: T) => {
  let callCount = 0;

  // add types here to make the spied functions share the same types as the passed in function
  const spyFunction = (...args: any[]) => {
    callCount++;
    return fn(...args);
  }

  spyFunction.getCallCount = () => callCount;

  return spyFunction;
}

const stringFunction = (key: string) => key;
const numberFunction = (n: number) => n;

// as expected, calling fn with a 
// @ts-expect-error
stringFunction(1);

// @ts-expect-error
numberFunction("string");

// notice that the starting type is `(...args: any[]) => any`
const spiedStringFunction = createSpyFunctionPreservingTypes(stringFunction)
// @ts-expect-error
spiedStringFunction(1)

// @ts-expect-error
createSpyFunctionPreservingTypes(numberFunction)("string")


type TimeoutRef = "fix me without importing any types :)";
class HowCanWeGetTimeoutType {
  private timeoutRef: TimeoutRef;

  constructor () {
    this.timeoutRef = setImmediate(() => {
      console.log("well done!");
    })
  }
}
