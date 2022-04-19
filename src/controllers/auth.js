import bcrypt from "bcryptjs";
import validator from "../validators/auth.js";
import { createToken } from "../helpers/token.js";
import { sendMail } from "../helpers/nodemailer.js";
import { generatePassword } from "../helpers/generate.js";
import Controller from "../controllers/AbstractController.js";

export default class Auth extends Controller {
  // Авторизация с возвратом сгенерированного токена
  static async login(req, res) {
    const params = {
      database: "users",
      collection: "users",
      filter: { email: req.body.email },
    };

    try {
      const user = await Controller.service.getDocument(params);

      validator.isEmail(req.body.email);
      validator.formatEmail(req.body.email);
      validator.isUser(user);
      validator.isPassword(req.body.password);
      validator.correctPassword(req.body.password, user.password);

      const token = createToken({
        id: user._id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium,
        password: req.body.password,
      });

      res.status(200).json({
        token: `Bearer ${token}`,
      });
    } catch (err) {
      Controller.errorHandler(res, err);
    }
  }

  // Восстановление пароля
  static async recovery(req, res) {
    const paramsUser = {
      database: "users",
      collection: "users",
      filter: { email: req.body.email },
    };
    
    try {
      const user = await Controller.service.getDocument(paramsUser);

      validator.isEmail(req.body.email);
      validator.formatEmail(req.body.email);
      validator.isUser(user);

      const newPassword = generatePassword();

      const info = {
        to: req.body.email,
        password: newPassword,
        subject: "Восстановление пароля",
        message: "Во вложении новый пароль, от вашего аккаунта.",
      };

      await sendMail(info);

      const paramsPassword = {
        database: "users",
        collection: "users",
        filter: { email: req.body.email },
        operator: {
          $set: {
            password: bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10)),
          },
        },
      };

      await Controller.service.updateDocument(paramsPassword);

      res.status(201).json({ message: "Пароль успешно изменен." });
    } catch (err) {
      Controller.errorHandler(res, err);
    }
  }
}