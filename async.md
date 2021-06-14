## async js practice

https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous

### convert callback to promises

You'll occasionally run into situations where you have a function that takes a callback. How do you set that up to work with promises?

```js
const path = require("path");
const fs = require("fs");
// note: using fs/promises is an easy solution here but that's not always an option :)

const getNamespaces = (cb) => {
  fs.readdir(path.join(__dirname, "../../language/en"), (err, files) => {
    if (err) {
      return cb(err);
    }

    return cb(
      null,
      files.map((filename) => path.basename(filename, ".json"))
    );
  });
};

const getNamespaceAsync = () => {};
```

```js
// how would you convert this to something that you could like `await untilFinished(req)`
function onFinished(req, callback) {
  let returned = false;
  req.on("finished", () => {
    if (returned) return;
    returned = true;
    return callback();
  });

  req.on("error", (err) => {
    if (returned) return;
    returned = true;
    return callback(err);
  });
}

async function untilFinished(req) {}
```

- knowing how to do this manually is important, but on the backend you do have access to https://nodejs.org/api/util.html#util_util_promisify_original

### convert promises based function to async/await

```js
const update = (properties: TeacherUpdatePayload) => {
  return updateUserObjectIfNeeded(properties)
    .then(() => updateNotificationSettingsIfNeeded(properties))
    .then(() => {
      if (
        properties.locale != null &&
        !localeValidator.test(properties.locale)
      ) {
        throw new Error(`invalid locale: ${properties.locale}`);
      }

      const avatarBig = imageUrl(
        properties.avatarBig ||
          _.get(_.get(properties._links, "avatarBig"), "href") ||
          ""
      );

      let title =
        properties.title && properties.title.substring(0, MAX_TITLE_LENGTH);
      if (BAD_IOS_TITLE_STRING_SET.has(title)) {
        title = "";
      }
      const firstName =
        properties.firstName &&
        removeHtml(properties.firstName.substring(0, MAX_NAME_LENGTH));
      const lastName =
        properties.lastName &&
        removeHtml(properties.lastName.substring(0, MAX_NAME_LENGTH));

      return new TeacherQueryBuilder()
        .innerJoinOn("user_teacher")
        .innerJoinOn("user")
        .updateAndFind(properties._id, {
          locale:
            properties.locale != null ? fix(properties.locale) : undefined,
          timezone: properties.timezone,
          photo: avatarBig,
          firstName,
          lastName,
          title,
          role: properties.role,
        });
    });
};
```

### write a custom promise implementation

Promises weren't originally part of js -- they got added in because people found promise libraries useful for dealing with async code. You can write your own implmenetation! Make sure it handles chaining properly :)

https://promisesaplus.com/

```js
class MyPromise {
  constructor(cb) {}
}
```

### what will log?

What are we going to log if we do the following? Why?

```js
(async function whatWillLog () {
  try {
    return Promise.reject();
  } catch (err) {
    console.log("catch 1");
  }
})().catch(() => console.log("catch 2"))
```

### write bluebird.delay without using async/await

```js
function delay(ms) {}

async function test() {
  for (let i = 0; i < 10; i++) {
    console.log(i);
    await delay(i * 1000);
  }
}
```

### write Promise.all without using async/await

```js
function PromiseAll(promises) {}

async function test() {
  const promises = _.range(0, 100).map((n) => delay(1000).then(() => n));
  const results = await PromiseAll(promises);
  console.log(results); // [0, 1, ..., 99]
}
```

### bug & bad pattern spotting

These are all real examples from our codebase. I think it's instructive to show what these mistakes actually look like. These are mistakes that all of us have made!

```js
flagProps = {};
filterFlags.forEach(async (name) => {
  flagProps[name] = await ServerSwitch.isOnForUserEntity(
    name,
    entity._id
  ).catch(() => false);
});
```

```js
const homeStudentLevels: HomeStudentLevelInfo[] = [];

await pMap(students, async (student) => {
  const homeStudentLevelInfo = await renderHomeStudentLevelInfoByStudent(
    student._id,
    "parent"
  );
  homeStudentLevels.push(homeStudentLevelInfo);
});
```

```js
const filterItemsForStudentInClass = async (
  items: Assignment.AssignmentObject[],
  studentIds: MongoId[]
): Promise<Assignment.AssignmentObject[]> => {
  return await pFilter(items, async (item) => {
    const isStudentInClass = await pMap(studentIds, (sid) =>
      Class.hasStudents(item.classId, [sid])
    );
    return _.some(isStudentInClass, Boolean);
  });
};
```

```js
const createIndividualNotification = async (
  blueshiftNotification: BlueShiftInAppMessage,
  entity: Entity
) => {
  const notification = formatBlueshiftNotification(blueshiftNotification);
  if (!notification) return null;

  try {
    const createdNotification = IndividualNotification.createUnbatchedNotification(
      VERB,
      { _id: entity._id, type: "parent" },
      { type: "dojo" },
      { type: "blueshift" },
      { ...notification, _id: new ObjectId().toString(), type: "blueshift" }
    );

    metrics.increment("blueshift.inapp.success");

    return createdNotification;
  } catch (err) {
    metrics.increment("blueshift.inapp.unable_to_save_notification");
    throw err;
  }
};
```

```js
export async function prepareForOutput(doc: HomeAwardRecordDocument): Promise<HomeAwardRecordObject>;
export async function prepareForOutput(doc: HomeAwardRecordDocument[]): Promise<HomeAwardRecordObject[]>;
export async function prepareForOutput(
  doc: HomeAwardRecordDocument | HomeAwardRecordDocument[],
): Promise<HomeAwardRecordObject | HomeAwardRecordObject[]> {
  if (Array.isArray(doc)) {
    return await pMap(doc, (item) => prepareForOutput(item));
  }

  if (Object.prototype.hasOwnProperty.call(doc, "dateAwarded")) {
    throw new Error("double preparing!");
  }

  const { award } = doc;
  const points = award.points != null ? award.points : doc.points || 0;
  if (award.positive == null) {
    if (points === 0) {
      // we default to positive
      console.flog({ productArea: "beyond" }, "0 point award doesn't have `positive` boolean", { doc });
    }
    award.positive = points >= 0;
  }

  const iconId = award.behaviorIconId || behaviorIconIdFromLegacyIconNumber(award.i, !!award.positive);
  const legacyIconNumber = doc.award.i || legacyBehaviorIconNumberFromIconId(iconId, !!award.positive);

  let date;
  if (isValidDate(doc.date)) {
    date = doc.date.toISOString();
  } else {
    date = String(doc.date);
  }

  const parentId = String(doc.parent.id);
  let parent;
  if (parentId) {
    parent = (await pOptional(Parent.findById(parentId))) || undefined;
  }

  const awardObj: HomeAwardRecordObject = {
    _id: String(doc._id),
    name: doc.award.name,
    dateAwarded: date,
    behaviorId: doc.award.behaviorId,
    behaviorIcon: getBehaviorIconUrl(iconId),
    behaviorIconNumber: legacyIconNumber,
    weight: points,
    positive: award.positive,
    valueDeducted: award.valueDeducted,
    student: {
      _id: String(doc.student.id),
      name: doc.student.name,
    },
    parent: {
      _id: String(doc.parent.id),
      name: doc.parent.name,
      firstName: parent && parent.firstName,
      lastName: parent && parent.lastName,
    },
    context: doc.context,
  };

  if (doc.deleted) awardObj.deleted = true;

  return awardObj;
}
```

```ts
async function _getUsage(
  entityType: EntityType,
  withUsageReport: boolean,
  entityId: MongoId
): Promise<UsageReport.UsageDetails | undefined> {
  try {
    if (entityType !== "teacher" || !withUsageReport) {
      return {};
    }

    return await UsageReport.getUsageForTeacher(entityId);
  } catch (err) {
    if (err.NotFound || /Not found/.test(err.message)) return;
    throw err;
  }
}
```

### other notes

- https://github.com/classdojo/api/blob/master/src/util/deferred.ts is worth a look. why is this pattern useful?
- custom thenables don't propagate async context. how would you change your custom promise implementation to support that? https://nodejs.org/api/async_hooks.html
