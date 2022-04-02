import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import keys from "../config/keys.js";
import validate from "../validates/auth.js";
import mongoClient from "../mongoDb/mongoClient.js";
import { generatePassword } from "../helpers/generate.js";
import MongoOptionsFactory from "../models/MongoOptions.js";
import { sendMail } from "../nodemailer/transporterMail.js";

const factory = new MongoOptionsFactory();

// Авторизация с возвратом сгенерированного токена
const login = async (req, res) => {
  try {
    const params = factory.createOptions({
      database: "users",
      filter: { email: req.body.email },
    });
    const user = await mongoClient.getDocument(params);

    // Проверки
    const err = validate.login(user, req);
    if (err) return res.status(err.status).json(err.data);

    // Отправка сгенерированного токена
    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium,
      },
      keys.jwt,
      { expiresIn: 21600 }
    );

    res.status(200).json({
      token: `Bearer ${token}`,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

// Восстановление пароля
const recovery = async (req, res) => {
  try {
    const paramsUser = factory.createOptions({
      database: "users",
      filter: { email: req.body.email },
    });
    const user = await mongoClient.getDocument(paramsUser);

    // Проверки
    const err = validate.recovery(user, req);
    if (err) return res.status(err.status).json(err.data);

    // Запись нового пароля в БД и отправка на почту пользователя
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
};

export default { login, recovery };
