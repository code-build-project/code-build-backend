import { MessageError } from "../models/Errors.js";

const getArticle = (req) => {
  // Проверка на пустое значение поля id
  if (!req.query.id) {
    throw new MessageError('IncorrectId', 'Нет обязательного параметра - id.', 400);
  }
}

export default { getArticle };
