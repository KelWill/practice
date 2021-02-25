// https://www.typescriptlang.org/docs/handbook/functions.html#overloads
// https://www.typescriptlang.org/docs/handbook/2/narrowing.html

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

// how would you solve this with generics?
function renderEntityWithGenerics (entity: Entity) {
  return entity;
}

const parent: Parent = renderEntityWithGenerics({type: "parent"});

// make sure you're still enforcing that this function only works for Teachers or Parents
// @ts-expect-error
const notAnEntity = renderEntityWithGenerics({type: "not an entity"});


type SchoolLeader = Teacher & {role: "school_leader"};
// update this function to make the if statement narrow properly :)
function isSchoolLeader (teacher: Teacher) {
  return teacher.role === "school_leader";
}
const maybeSchoolLeader: Teacher = {type: "teacher", role: "school_leader"};

if (isSchoolLeader(maybeSchoolLeader)) {
  const schoolLeader: SchoolLeader = maybeSchoolLeader;
}


