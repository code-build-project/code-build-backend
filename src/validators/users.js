import Validator from "../validators/abstractValidator.js";

const regexPassword = /^[a-zа-яё0-9-_!@#$%^&*()=+`~?]+$/;

export default class Users extends Validator {
  static hasOldPassword(oldPassword) {
    if (!oldPassword) {
      throw new Validator.Message('IncorrectPassword', 'Поле oldPassword не может быть пустым.', 400);
    }
  }

  static correctPassword(password, realPassword) {
    if (password !== realPassword) {
      throw new Validator.Message('IncorrectPassword', 'Неправильный пароль!', 401);
    }
  }

  static minLengthPassword(length) {
    if (length < 8) {
      throw new Validator.Message('IncorrectPassword', 'Поле newPassword не может быть меньше 8 символов.', 400);
    }
  }

  static maxLengthPassword(length) {
    if (length < 12) {
      throw new Validator.Message('IncorrectPassword', 'Поле newPassword не может быть больше 12 символов.', 400);
    }
  }

  static hasGapsPassword(password) {
    if (password.includes(' ')) {
      throw new Validator.Message('IncorrectPassword', 'Поле newPassword не может содержать пробелы.', 400);
    }
  }

  static hasInvalidCharacters(password) {
    if (!regexPassword.test(password)) {
      throw new Validator.Message('IncorrectPassword', 'Поле newPassword содержит недопустимые символы.', 400);
    }
  }

  static matchPasswords(oldPassword, newPassword) {
    if (oldPassword === newPassword) {
      throw new Validator.Message('IncorrectPassword', 'Поле newPassword не может совпадать с полем oldPassword.', 400);
    }
  }
}