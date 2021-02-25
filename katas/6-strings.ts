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
