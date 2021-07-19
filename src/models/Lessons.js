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