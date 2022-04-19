import Validator from "../validators/abstractValidator.js";

export default class Courses extends Validator {
  static isCourse(course) {
    if (!course) {
      throw new Validator.Message('NotFound', 'Курса с данным id не существует.', 404);
    }
  }
}