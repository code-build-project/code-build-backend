import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import keys from "../config/keys.js";
import mongoClient from "../mongoDb/mongoClient.js";
import MongoOptionsFactory from "../models/MongoOptions.js";

const factory = new MongoOptionsFactory();

// Авторизация с возвратом сгенерированного токена
export const login = async (req, res) => {
  try {
    // Проверка существования пользователя
    const params = factory.createOptions({
      database: "users",
      filter: { email: req.body.email },
    });

    const user = await mongoClient.getDocument(params);

    if (!user) {
      const message = "Пользователь с таким e-mail не зарегистрирован.";
      return res.status(401).json({ message });
    }

    // Проверка на пустое значение пароля
    if (!req.body.password) {
      const message = "Значение пароля не должно быть пустым.";
      return res.status(400).json({ message });
    }

    // Проверка на совпадение пароля от клинета и пароля в БД
    const password = bcrypt.compareSync(req.body.password, user.password);

    if (!password) {
      const message = "Неправильный пароль!";
      return res.status(401).json({ message });
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
      { expiresIn: 3600 }
    );

    res.status(200).json({
      token: `Bearer ${token}`,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};
