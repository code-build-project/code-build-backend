import mongodb from "mongodb";
import jwt from "jsonwebtoken";
import keys from "../config/keys.js";
import { User } from "../models/User.js";
import mongoClient from "../mongoDb/mongoClient.js";
import MongoOptionsFactory from "../models/MongoOptions.js";

const { ObjectId } = mongodb;
const factory = new MongoOptionsFactory();

// Получение данных пользователя по токену
export const getUser = (req, res) => {
  //Токен валидный, возвращаем данные пользователя
  try {
    const decoded = jwt.verify(req.headers.authorization, keys.jwt);
    res.status(200).json(new User(decoded));
  } catch (err) {
    // Неверный токен, возвращаем ошибку
    res.status(401).json({
      message: `Ошибка: ${err}`,
    });
  }
};

// Изменить имя пользователя
export const changeUserName = async (req, res) => {
  const params = factory.createOptions({
    database: "users",
    filter: { _id: ObjectId(req.headers.userId) },
    operator: {
      $set: {
        name: req.body.name,
      },
    },
  });

  try {
    let response = await mongoClient.updateDocument(params);
    response = new User(response.value);

    // Генерация нового токена
    const token = jwt.sign(
      {
        _id: response.id,
        name: req.body.name,
        email: response.email,
        isPremium: response.isPremium,
      },
      keys.jwt,
      { expiresIn: 3600 }
    );

    res.status(200).json({
      token: `Bearer ${token}`,
    });
  } catch (err) {
    res.status(401).json({
      message: `Ошибка: ${err}`,
    });
  }
};
