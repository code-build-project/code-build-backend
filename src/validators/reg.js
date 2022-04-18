import bcrypt from "bcryptjs";
import Validator from "../validators/abstractValidator.js";

export default class Reg extends Validator {
  static maxLengthEmail(length) {
    if (length > 42) {
      throw new Validator.Message('IncorrectEmail', 'Поле email не может быть больше 42 символов.', 400);
    }
  }

  static isUser(user) {
    if (user) {
      throw new Validator.Message('IncorrectEmail', 'Пользователь с таким e-mail уже зарегистрирован.', 401);
    }
  }

  static isCandidate(candidate) {
    if (candidate) {
      throw new Validator.Message('IncorrectEmail', 'Срок действия предыдущего пароля еще не истек.', 409);
    }
  }

  static timeRegCandidate(candidate) {
    if (!candidate) {
      throw new Validator.Message('IncorrectPassword', 'Время подтверждения регистрации истекло.', 401);
    }
  }

  static correctPassword(password, passwordCandidate) {
    const isPassword = bcrypt.compareSync(password, passwordCandidate);

    if (!isPassword) {
      throw new Validator.Message('IncorrectPassword', 'Неправильный пароль!', 401);
    }
  }
}