import Validator from "../validators/abstractValidator.js";

export default class Likes extends Validator {
  static isField(isField, field) {
    if (!isField) {
      throw new Validator.Message('IncorrectField', `Коллекции ${field} не существует.`, 400);
    }
  }

  static isDocument(document, id, field) {
    if (!document) {
      throw new Validator.Message('IncorrectId', `${field} c id = ${id} не существует.`, 400);
    }
  }
}