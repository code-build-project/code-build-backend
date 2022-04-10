import bcrypt from "bcryptjs";
import validate from "../validates/auth.js";
import { createToken } from "../helpers/token.js";
import { generatePassword } from "../helpers/generate.js";
import { sendMail } from "../nodemailer/transporterMail.js";
import Controller from "../controllers/AbstractController.js";

export default class Auth extends Controller {
  // Авторизация с возвратом сгенерированного токена
  static async login(req, res) {
    const params = Controller.createOptions({
      database: "users",
      filter: { email: req.body.email },
    });

    try {
      const user = await Controller.service.getDocument(params);

      validate.login(req, user);

      const token = createToken({
        _id: user._id,
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
    const paramsUser = Controller.createOptions({
      database: "users",
      filter: { email: req.body.email },
    });
    
    try {
      const user = await Controller.service.getDocument(paramsUser);

      validate.recovery(req, user);

      const newPassword = generatePassword();

      const info = {
        to: req.body.email,
        password: newPassword,
        subject: "Восстановление пароля",
        message: "Во вложении новый пароль, от вашего аккаунта.",
      };

      await sendMail(info);

      const paramsPassword = Controller.createOptions({
        database: "users",
        filter: { email: req.body.email },
        operator: {
          $set: {
            password: bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10)),
          },
        },
      });

      await Controller.service.updateDocument(paramsPassword);

      const message = "Пароль успешно изменен.";
      return res.status(201).json({ message });
    } catch (err) {
      Controller.errorHandler(res, err);
    }
  }
}
