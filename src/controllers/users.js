import mongodb from "mongodb";
import jwt from "jsonwebtoken";
import keys from "../config/keys.js";
import { User } from "../models/Users.js";
import mongoClient from "../mongoDb/mongoClient.js";
import MongoOptionsFactory from "../models/MongoOptions.js";

const { ObjectId } = mongodb;
const factory = new MongoOptionsFactory();

// Получение данных пользователя по токену
export const getUser = async (req, res) => {
  //Токен валидный, возвращаем данные пользователя
  try {
    const decoded = jwt.verify(req.headers.authorization, keys.jwt);

    const params = factory.createOptions({
      database: "users",
      filter: { email: decoded.email },
    });

    const user = await mongoClient.getDocument(params);
    res.status(200).json(new User(user));
  } catch (err) {
    // Неверный токен, возвращаем ошибку
    res.status(401).json(err);
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
    res.status(200).json(new User(response.value));
  } catch (err) {
    res.status(401).json({
      message: `Ошибка: ${err}`,
    });
  }
};
