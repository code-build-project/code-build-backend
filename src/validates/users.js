import { MessageError } from "../models/Responses.js";

const regexName = /^[a-zа-яё\-]+$/i;
const regexPassword = /^[a-zа-яё0-9-_!@#$%^&*()=+`~?]+$/;

const changeUserName = (req) => {
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
    return new MessageError('IncorrectName', 'Поле name не может быть больше 20 символов.', 400);
  }
}

const changeUserPassword = (req, res) => {
  // Проверка на пустое значение пароля
  if (!req.body.oldPassword) {
    return new MessageError('IncorrectPassword', 'Значение пароля не должно быть пустым.', 400);
  }

  // Проверка на совпадение пароля от клинета и пароля в БД кандадатов
  if (req.body.oldPassword !== res.locals.user.password) {
    return new MessageError('IncorrectPassword', 'Неправильный пароль.', 401);
  }

  // Проверка минимального количества символов нового пароля
  if (req.body.newPassword.length < 8) {
    return new MessageError('IncorrectPassword', 'Поле newPassword не может быть меньше 8 символов.', 400);
  }

  // Проверка максимального количества символов нового пароля
  if (req.body.newPassword.length > 12) {
    return new MessageError('IncorrectPassword', 'Поле newPassword не может быть больше 12 символов.', 400);
  }

  // Проверка у нового пароля наличия пробелов
  if (req.body.newPassword.includes(' ')) {
    return new MessageError('IncorrectPassword', 'Поле newPassword не может содержать пробелы.', 400);
  }

  // Проверка у нового пароля наличия недопустимых символов
  if (!regexPassword.test(req.body.newPassword)) {
    return new MessageError('IncorrectPassword', 'Поле newPassword содержит недопустимые символы.', 400);
  }

  // Проверка на совпадение старого и нового паролей
  if (req.body.newPassword === req.body.oldPassword) {
    return new MessageError('IncorrectPassword', 'Поле newPassword не может совпадать с полем oldPassword.', 400);
  }
};

export default { changeUserName, changeUserPassword };
