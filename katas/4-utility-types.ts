// https://www.typescriptlang.org/docs/handbook/utility-types.html
// it's a little hard to contstruct nicely failing tests here
// and it's worth reading the utility types carefully! they're useful :)

type EntityType = "teacher" | "parent" | "school_leader" | "student";

// how do you type the return type by manipulating `EntityType`?
function isAdult (entityType: EntityType) {
  return ["teacher", "parent", "school_leader"].includes(entityType);
}

function onlyTakesStudents(entityType: "student") {}

function doSomething (entityType: EntityType) {
  if (isAdult(entityType)) {
    // do nothing
  } else {
    onlyTakesStudents(entityType);
  }
}
