import bcrypt from "bcryptjs";
import { MessageError } from "../models/Errors.js";

const regexEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
const regexName = /^[a-zа-яё\-]+$/i;

const create = (req, user, candidate) => {
  // Проверка на пустое значение поля name
  if (!req.body.name) {
    throw new MessageError('IncorrectName', 'Поле name не может быть пустым.', 400);
  }

  // Проверка на правильный формат name
  if (!regexName.test(req.body.name)) {
    throw new MessageError('IncorrectName', 'Поле name содержит недопустимые символы.', 400);
  }

  // Проверка максимального количества символов name
  if (req.body.name.length > 20) {
    throw new MessageError('IncorrectName', 'Поле name не может быть больше 15 символов.', 400);
  }

  // Проверка на правильный формат email
  if (!regexEmail.test(req.body.email)) {
    throw new MessageError('IncorrectEmail', 'Неверный формат поля email.', 400);
  }

  // Проверка максимального количества символов email
  if (req.body.email.length > 42) {
    throw new MessageError('IncorrectEmail', 'Поле email не может быть больше 42 символов.', 400);
  }

  // Проверка существования пользователя
  if (user) {
    throw new MessageError('IncorrectEmail', 'Пользователь с таким e-mail уже зарегистрирован.', 401);
  }

  // Проверка отправки пароля на данный email ранее
  if (candidate) {
    throw new MessageError('IncorrectEmail', 'Срок действия предыдущего пароля еще не истек.', 409);
  }
};

const confirm = (req, user, candidate) => {
  // Проверка на правильный формат email
  if (!regexEmail.test(req.body.email)) {
    throw new MessageError('IncorrectEmail', 'Неверный формат поля email.', 400);
  }

  // Проверка на существования пользователя в БД
  if (user) {
    throw new MessageError('IncorrectEmail', 'Такой e-mail уже зарегестрирован.', 409);
  }

  // Проверка существования кандидата в БД
  if (!candidate) {
    throw new MessageError('IncorrectPassword', 'Время подтверждения регистрации истекло.', 401);
  }

  // Проверка на пустое значение пароля
  if (!req.body.password) {
    throw new MessageError('IncorrectPassword', 'Поле password не может быть пустым.', 400);
  }

  // Проверка на совпадение пароля от клинета и пароля в БД кандадатов
  const password = bcrypt.compareSync(req.body.password, candidate.password);

  if (!password) {
    throw new MessageError('IncorrectPassword', 'Неправильный пароль!', 401);
  }
};

export default { create, confirm };
