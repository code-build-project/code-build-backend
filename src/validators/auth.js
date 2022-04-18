import bcrypt from "bcryptjs";
import Validator from "../validators/abstractValidator.js";

export default class Auth extends Validator {
  static correctPassword(password, realPassword) {
    const isPassword = bcrypt.compareSync(password, realPassword);

    if (!isPassword) {
      throw new Validator.Message('IncorrectPassword', 'Неправильный пароль!', 401);
    }
  }
}