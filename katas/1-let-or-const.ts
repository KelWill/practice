// https://www.typescriptlang.org/docs/handbook/variable-declarations.html

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

// why does this last one work?
doSomething({method: "GET"});

