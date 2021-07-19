export class Parameters {
  constructor(database, collection, filter, operator) {
    this.database = database;
    this.collection = collection;
    this.filter = filter;
    this.operator = operator;
  }
}

export class Lesson {
  constructor(lesson) {
    this._id = lesson._id;
    this.lessonNamuber = lesson.lessonNamuber;
    this.title = lesson.title;
    this.time = lesson.time;
    this.views = lesson.views;
    this.courseName = lesson.courseName;
    this.likes = lesson.likes;
  }
}