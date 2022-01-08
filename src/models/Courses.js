export class Course {
  constructor(course) {
    this.id = course.id;
    this.title = course.title;
    this.subtitle = course.subtitle;
    this.level = course.level;
    this.lessons = course.lessons;
    this.time = course.time;
    this.views = course.views;
    this.tags = course.tags;
    this.likes = course.likes;
    this.image = course.image;
  }
}