export default class Lesson {
    constructor(lesson) {
        this.id = lesson.id;
        this.number = lesson.number;
        this.title = lesson.title;
        this.time = lesson.time;
        this.views = lesson.views;
        this.courseId = lesson.courseId;
        this.image = lesson.image;
        this.video = lesson.video;
    }
}