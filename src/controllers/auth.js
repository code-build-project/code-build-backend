import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import keys from "../config/keys.js";
import mongoClient from "../mongoDb/mongoClient.js";
import { Parameters } from "../models/Auth.js";

// Авторизация с возвратом сгенерированного токена
export const login = async (req, res) => {
  const params = new Parameters(
    "users",
    "users",
    { email: req.body.email },
    {}
  );

  const candidate = await mongoClient.getDocument(params);

  // Пользователь существует, проверка пароля
  if (candidate) {
    const password = bcrypt.compareSync(req.body.password, candidate.password);

    // Пароли совпали, генерация токена
    if (password) {
      const token = jwt.sign(
        {
          email: candidate.email,
          id: candidate._id,
          name: candidate.name,
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
        message: "Неправильный логин или пароль!",
      });
    }
  }
  // Пользователя нет, ошибка
  else {
    res.status(404).json({
      message: "Неправильный логин или пароль!",
    });
  }
};
