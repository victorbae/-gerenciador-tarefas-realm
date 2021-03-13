import { ObjectId } from "bson";

class Task {

  static STATUS_OPEN = "Open";
  static STATUS_IN_PROGRESS = "InProgress";
  static STATUS_COMPLETE = "Complete";
  static schema = {
    name: "Task",
    properties: {
      _id: "objectId",
      _partition: "string?",
      name: "string",
      status: "string",
    },
    primaryKey: "_id",
    required : ["_id", "name", "status"]
  };
}

class User {

  static schema = {
    name: "User",
    properties: {
      _id: "objectId",
      _partition: "string?",
      email: "string",
      password: "string",
    },
    primaryKey: "_id",
    required : ["_id", "email", "password"]
  };
}

export { Task, User };
