import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import keys from "../config/keys.js";
import mongoClient from "../mongoDb/mongoClient.js";
import MongoOptionsFactory from "../models/MongoOptions.js";

const factory = new MongoOptionsFactory();

// Авторизация с возвратом сгенерированного токена
export const login = async (req, res) => {
  const params = factory.createOptions({
    database: "users",
    filter: { email: req.body.email },
  });

  const candidate = await mongoClient.getDocument(params);

  // Пользователь существует, проверка пароля
  if (candidate) {
    const password = bcrypt.compareSync(req.body.password, candidate.password);

    // Пароли совпали, генерация токена
    if (password) {
      const token = jwt.sign(
        {
          _id: candidate._id,
          name: candidate.name,
          email: candidate.email,
          isPremium: candidate.isPremium,
        },
        keys.jwt,
        { expiresIn: 3600 }
      );

      res.status(200).json({
        token: `Bearer ${token}`,
      });
    }
    // Пароли не совпали, ошибка
    else {
      res.status(401).json({
        message: "Неправильный пароль!",
      });
    }
  }
  // Пользователя нет, ошибка
  else {
    res.status(401).json({
      message: "Пользователь с таким e-mail не зарегистрирован.",
    });
  }
};
