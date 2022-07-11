import Validator from "../validators/abstractValidator.js";

export default class Auth extends Validator {
    static isUser(user) {
        if (!user) {
            throw new Validator.Message(
                "IncorrectEmail",
                "Пользователь с таким e-mail не зарегистрирован.",
                401
            );
        }
    }
}