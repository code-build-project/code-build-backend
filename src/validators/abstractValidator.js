import bcrypt from "bcryptjs";
import MessageError from "../models/Error.js";

const regexName = /^[a-zа-яё\-]+$/i;
const regexEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

export default class AbstractValidator {
    static Message = MessageError;

    static isId(id) {
        if (!id) {
            throw new MessageError("IncorrectId", "Отсутствует обязательный параметр id.", 400);
        }
    }

    static isName(name) {
        if (!name) {
            throw new MessageError("IncorrectName", "Отсутствует обязательный параметр name.", 400);
        }
    }

    static isEmail(email) {
        if (!email) {
            throw new MessageError(
                "IncorrectEmail",
                "Отсутствует обязательный параметр email.",
                400
            );
        }
    }

    static isPassword(password) {
        if (!password) {
            throw new MessageError(
                "IncorrectPassword",
                "Отсутствует обязательный параметр password.",
                400
            );
        }
    }

    static formatName(name) {
        if (!regexName.test(name)) {
            throw new MessageError(
                "IncorrectName",
                "Поле name содержит недопустимые символы.",
                400
            );
        }
    }

    static formatEmail(email) {
        if (!regexEmail.test(email)) {
            throw new MessageError("IncorrectEmail", "Неверный формат поля email.", 400);
        }
    }

    static maxLengthName(length, max) {
        if (length > max) {
            throw new MessageError(
                "IncorrectName",
                `Поле name не может быть больше ${max} символов.`,
                400
            );
        }
    }

    static correctPassword(password, passwordHash, field) {
        const isPassword = bcrypt.compareSync(password, passwordHash);

        if (!isPassword) {
            throw new MessageError("IncorrectPassword", "Неправильный пароль!", 401, field);
        }
    }
}