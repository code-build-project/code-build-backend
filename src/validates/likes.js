import { MessageError } from "../models/Errors.js";

const addLike = (req, document, isField) => {
  // Проверка существования коллекции
  if (!isField) {
    throw new MessageError('IncorrectField', `Коллекции ${req.body.field} не существует.`, 400);
  }

  // Проверка на существование в бд документа с id, который был передан
  if (!document) {
    throw new MessageError('IncorrectId', `${req.body.field} c id = ${req.body.id} не существует.`, 400);
  }
}

const deleteLike = (req, isField) => {
  // Проверка существования коллекции
  if (!isField) {
    throw new MessageError('IncorrectField', `Коллекции ${req.body.field} не существует.`, 400);
  }
}

export default { addLike, deleteLike };
