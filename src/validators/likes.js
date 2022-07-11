import Validator from "../validators/abstractValidator.js";

export default class Likes extends Validator {
    static isField(field) {
        if (!field) {
            throw new Validator.Message(
                "IncorrectField",
                "Отсутствует обязательный параметр field.",
                400
            );
        }
    }

    static isCourseId(field, courseId) {
        if (field === "lessons" && !courseId) {
            throw new Validator.Message(
                "IncorrectCourseId",
                "Отсутствует обязательный параметр courseId.",
                400
            );
        }
    }

    static hasField(isField, field) {
        if (!isField) {
            throw new Validator.Message("IncorrectField", `Коллекции ${field} не существует.`, 400);
        }
    }

    static hasDocument(document, id, field) {
        if (!document) {
            throw new Validator.Message("IncorrectId", `${field} c id = ${id} не существует.`, 400);
        }
    }
}