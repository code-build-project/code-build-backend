export class Parameters {
  constructor(database, collection, filter, operator) {
    this.database = database;
    this.collection = collection;
    this.filter = filter;
    this.operator = operator;
  }
}

export class Course {
  constructor(course) {
    this._id = course._id;
    this.title = course.title;
    this.level = course.level;
    this.lessons = course.lessons;
    this.time = course.time;
    this.views = course.views;
    this.tags = course.tags;
    this.likes = course.likes;
    this.courseName = course.courseName;
  }
}