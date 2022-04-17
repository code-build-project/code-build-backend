import { MessageError } from "../models/Errors.js";

const getArticle = (req) => {
  // Проверка на пустое значение поля id
  if (!req.query.id) {
    throw new MessageError('IncorrectId', 'Отсутствует обязательный параметр id.', 400);
  }
}

export default { getArticle };
