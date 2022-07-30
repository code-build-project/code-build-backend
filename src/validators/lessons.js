import Validator from "../validators/abstractValidator.js";

export default class Lessons extends Validator {
    static isCourseId(courseId) {
        if (!courseId) {
            throw new Validator.Message(
                "IncorrectId",
                "Отсутствует обязательный параметр courseId.",
                400
            );
        }
    }

    static isLesson(lesson) {
        if (!lesson) {
            throw new Validator.Message("NotFound", "Урока с данным id не существует.", 404);
        }
    }
}