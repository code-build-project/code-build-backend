import MessageError from "../models/Error.js";

const regexName = /^[a-zа-яё\-]+$/i;
const regexEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

export default class AbstractValidator {
  static Message = MessageError;
  
  static maxLengthName(length, max) {
    if (length > max) {
      throw new MessageError('IncorrectName', `Поле name не может быть больше ${max} символов.`, 400);
    }
  }

  static formatName(name) {
    if (!regexName.test(name)) {
      throw new MessageError('IncorrectName', 'Поле name содержит недопустимые символы.', 400);
    }
  }

  static formatEmail(email) {
    if (!regexEmail.test(email)) {
      throw new MessageError('IncorrectEmail', 'Неверный формат поля email.', 400);
    }
  }

  static isUser(user) {
    if (!user) {
      throw new MessageError('IncorrectEmail', 'Пользователь с таким e-mail не зарегистрирован.', 401);
    }
  }

  static isFindResource(resource) {
    if (!resource) {
      throw new MessageError('NotFound', 'Ресурс с данным id не существует.', 404);
    }
  }

  static hasId(id) {
    if (!id) {
      throw new MessageError('IncorrectId', 'Отсутствует обязательный параметр id.', 400);
    }
  }

  static hasName(name) {
    if (!name) {
      throw new MessageError('IncorrectName', 'Поле name не может быть пустым.', 400);
    }
  }

  static hasPassword(password) {
    if (!password) {
      throw new MessageError('IncorrectPassword', 'Поле password не может быть пустым.', 400);
    }
  }
}