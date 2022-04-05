import bcrypt from "bcryptjs";
import validate from "../validates/auth.js";
import { createToken } from "../helpers/token.js";
import mongoClient from "../mongoDb/mongoClient.js";
import { generatePassword } from "../helpers/generate.js";
import MongoOptionsFactory from "../models/MongoOptions.js";
import { sendMail } from "../nodemailer/transporterMail.js";

const factory = new MongoOptionsFactory();

export default class Auth {
  // Авторизация с возвратом сгенерированного токена
  static async login(req, res) {
    const params = factory.createOptions({
      database: "users",
      filter: { email: req.body.email },
    });

    try {
      const user = await mongoClient.getDocument(params);

      const err = validate.login(req, user);
      if (err) return res.status(err.status).json(err.data);

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
      res.status(500).json(err);
    }
  }

  // Восстановление пароля
  static async recovery(req, res) {
    const paramsUser = factory.createOptions({
      database: "users",
      filter: { email: req.body.email },
    });
    
    try {
      const user = await mongoClient.getDocument(paramsUser);

      const err = validate.recovery(req, user);
      if (err) return res.status(err.status).json(err.data);

      const newPassword = generatePassword();

      const info = {
        to: req.body.email,
        password: newPassword,
        subject: "Восстановление пароля",
        message: "Во вложении новый пароль, от вашего аккаунта.",
      };

      await sendMail(info);

      const paramsPassword = factory.createOptions({
        database: "users",
        filter: { email: req.body.email },
        operator: {
          $set: {
            password: bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10)),
          },
        },
      });

      await mongoClient.updateDocument(paramsPassword);

      const message = "Пароль успешно изменен.";
      return res.status(201).json({ message });
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
