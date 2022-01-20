import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import keys from "../config/keys.js";
import mongoClient from "../mongoDb/mongoClient.js";
import { generatePassword } from "../helpers/generate.js";
import MongoOptionsFactory from "../models/MongoOptions.js";
import { sendMail } from "../nodemailer/transporterMail.js";

const factory = new MongoOptionsFactory();

// Авторизация с возвратом сгенерированного токена
const login = async (req, res) => {
  try {
    // Проверка существования пользователя
    const params = factory.createOptions({
      database: "users",
      filter: { email: req.body.email },
    });

    const user = await mongoClient.getDocument(params);

    if (!user) {
      const err = {
        name: "IncorrectEmail",
        message: "Пользователь с таким e-mail не зарегистрирован.",
      };
      return res.status(401).json(err);
    }

    // Проверка на пустое значение пароля
    if (!req.body.password) {
      const err = {
        name: "IncorrectPassword",
        message: "Поле пароля не должно быть пустым.",
      };
      return res.status(400).json(err);
    }

    // Проверка на совпадение пароля от клинета и пароля в БД
    const password = bcrypt.compareSync(req.body.password, user.password);

    if (!password) {
      const err = {
        name: "IncorrectPassword",
        message: "Неправильный пароль!",
      };
      return res.status(401).json(err);
    }

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

    if (!user) {
      const err = {
        name: "IncorrectEmail",
        message: "Пользователь с таким e-mail не зарегистрирован.",
      };
      return res.status(401).json(err);
    }

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
