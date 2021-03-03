/* ----------------------------- let or const ------------------------ */

// https://www.typescriptlang.org/docs/handbook/variable-declarations.html
// the way typescript calculates a type isn't always quite what you expect
// where do we sometimes see errors like this? why do we sometimes need `as const` in your codebase?

function doSomething (o: DontUseThisTypeToFix) {}
type DontUseThisTypeToFix = {
  method: "GET" | "PUT"
}

const options = { method: "GET" }
type Hint = typeof options;
doSomething(options);

let method = "GET";
type Hint2 = typeof method;
doSomething({method});

let method2 = "GET" as const
type Hint3 = typeof method2;
doSomething({ method: method2 });

// why does these last variations work?
doSomething({method: "GET"});
const method3 = "GET";
doSomething({method: method3});

/* ----------------------- narrowing ------------------------- */

// https://www.typescriptlang.org/docs/handbook/functions.html#overloads
// https://www.typescriptlang.org/docs/handbook/2/narrowing.html
// we don't always help typescript do type narrowing in our codebase
// and it often leads to code that looks like `as unknown as X`
// that's almost always a sign that we've screwed up our types somehow

function swapStringsAndNumbers (a: string | number) {
  if (typeof a === "string") return parseInt(a);
  return a.toLocaleString();
}
// how do we get n to show up as a number?
const n: number = swapStringsAndNumbers("a");

type Teacher = { type: "teacher", role?: string };
type Parent = { type: "parent" };
type Entity = Teacher | Parent;

// how do set up `renderEntity` to preserve the type of its input? no using generics!
function renderEntity (entity: Entity) {
  return entity;
}
const teacher: Teacher = renderEntity({type: "teacher"});

// could you instead solve this using generics? i.e. `renderEntityWithGenerics<T> (entity: Entity)`
function renderEntityWithGenerics (entity: Entity) {
  return entity;
}

const parent: Parent = renderEntityWithGenerics({type: "parent"});

// make sure you're still enforcing that this function only works for Teachers or Parents
// hint: you'll want to constrain the generic T using the 'extends' keyword
// @ts-expect-error
const notAnEntity = renderEntityWithGenerics({type: "not an entity"});

type SchoolLeader = Teacher & {role: "school_leader"};
// update this function to make the if statement narrow properly :) ("is")
function isSchoolLeader (teacher: Teacher) {
  return teacher.role === "school_leader";
}
const maybeSchoolLeader: Teacher = {type: "teacher", role: "school_leader"};
if (isSchoolLeader(maybeSchoolLeader)) {
  const schoolLeader: SchoolLeader = maybeSchoolLeader;
}

// we'll sometimes use `Brand<Type, 'name'>` in our codebase. how would you set up a function that uses a branded string?
// under the hood, that's basically setting the type to `string & {__super_secret: "brand type of this thing"}`
// or `number & {__super_secret: "a number with special characteristics"}
function asEmail (emailAddress: string) {
  if (!emailAddress.includes("@")) throw new Error("not an email");
  return emailAddress;
}
type EmailAddress = string & {__brand: true};
const email: EmailAddress = asEmail("email@classdojo.com");

// next level: how would you set up a `Brand<T, Name>` that allows branding arbitrary strings or numbers?

/* ----------------------------- function utilities ------------------------ */
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
// @ts-expect-error
stringFunction(1);


const numberFunction = (n: number) => n;
// @ts-expect-error
numberFunction("string");


const spiedStringFunction = createSpyFunctionPreservingTypes(stringFunction)
type SpyHint = typeof spiedStringFunction;
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


/* ----------------------------- type utilities ------------------------ */

// https://www.typescriptlang.org/docs/handbook/utility-types.html
// it's a little hard to contstruct nicely failing tests here
// and it's worth reading the utility types carefully! they're useful :)
type EntityType = "teacher" | "parent" | "school_leader" | "student";


// how do you type the return type by manipulating `EntityType`?
function isAdult (entityType: EntityType) {
  return ["teacher", "parent", "school_leader"].includes(entityType);
}

function onlyTakesStudents(entityType: "student") {}

function doThing (entityType: EntityType) {
  if (isAdult(entityType)) {
    // do nothing
  } else {
    onlyTakesStudents(entityType);
  }
}


/* ----------------------------- what's next?? ------------------------ */

// https://github.com/type-challenges/type-challenges has an amazing set of challenges
// they show you how to do things like the challenge below:

// https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html
// Conditional Types: https://www.typescriptlang.org/docs/handbook/2/conditional-types.html

// update me to get this working!
// the final type should look like:
type GoalType = {
  studentId: string,
  classId: string,
}
type GetParameters<T extends string> = T;

const params: GetParameters<"/api/dojoClass/:classId/student/:studentId"> = {
  "studentId": "123",
  "classId": "456",
}

// can you make this MongoId check more stringent by checking that mongo ids are 24 characters long?
// hint, you'll want to use a tuple-typed accumulator
type MongoId = string;

// @ts-expect-error
const notAMongoId: MongoId = "54346123";
const mongoId: MongoId = "603823098de57a53ed85cb58";
 