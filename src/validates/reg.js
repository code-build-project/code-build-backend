import bcrypt from "bcryptjs";
import { MessageError } from "../models/Responses.js";

const regexEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
const regexName = /^[a-zа-яё\-]+$/i;

const create = (user, candidate, req) => {
  // Проверка на пустое значение поля name
  if (!req.body.name) {
    return new MessageError('IncorrectName', 'Поле name не может быть пустым.', 400);
  }

  // Проверка на правильный формат name
  if (!regexName.test(req.body.name)) {
    return new MessageError('IncorrectName', 'Поле name содержит недопустимые символы.', 400);
  }

  // Проверка максимального количества символов name
  if (req.body.name.length > 20) {
    return new MessageError('IncorrectName', 'Поле name не может быть больше 15 символов.', 400);
  }

  // Проверка на правильный формат email
  if (!regexEmail.test(req.body.email)) {
    return new MessageError('IncorrectEmail', 'Неверный формат email.', 400);
  }

  // Проверка максимального количества символов email
  if (req.body.email.length > 42) {
    return new MessageError('IncorrectEmail', 'Поле email не может быть больше 42 символов.', 400);
  }

  // Проверка существования пользователя
  if (user) {
    return new MessageError('IncorrectEmail', 'Пользователь с таким e-mail уже зарегистрирован.', 401);
  }

  // Проверка отправки пароля на данный email ранее
  if (candidate) {
    return new MessageError('IncorrectEmail', 'Срок действия предыдущего пароля еще не истек.', 409);
  }
};

const confirm = (user, candidate, req) => {
  // Проверка на правильный формат email
  if (!regexEmail.test(req.body.email)) {
    return new MessageError('IncorrectEmail', 'Неверный формат email.', 400);
  }

  // Проверка на существования пользователя в БД
  if (user) {
    return new MessageError('IncorrectEmail', 'Такой e-mail уже зарегестрирован.', 409);
  }

  // Проверка существования кандидата в БД
  if (!candidate) {
    return new MessageError('IncorrectPassword', 'Время подтверждения регистрации истекло.', 401);
  }

  // Проверка на пустое значение пароля
  if (!req.body.password) {
    return new MessageError('IncorrectPassword', 'Поле password не может быть пустым.', 400);
  }

  // Проверка на совпадение пароля от клинета и пароля в БД кандадатов
  const password = bcrypt.compareSync(req.body.password, candidate.password);

  if (!password) {
    return new MessageError('IncorrectPassword', 'Неправильный пароль.', 401);
  }
};

export default { create, confirm };
