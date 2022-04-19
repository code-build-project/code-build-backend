import Validator from "../validators/abstractValidator.js";

export default class Articles extends Validator {
  static isArticle(article) {
    if (!article) {
      throw new Validator.Message('NotFound', 'Статьи с данным id не существует.', 404);
    }
  }
}