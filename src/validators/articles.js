import Validator from "../validators/abstractValidator.js";

export default class Articles extends Validator {
  static isFindResource(resource) {
    if (!resource) {
      throw new Validator.Message('NotFound', 'Статьи с данным id не существует.', 404);
    }
  }
}