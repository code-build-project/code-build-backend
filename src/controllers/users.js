import bcrypt from "bcryptjs";
import mongodb from "mongodb";
import jwt from "jsonwebtoken";
import keys from "../config/keys.js";
import { User } from "../models/Users.js";
import validate from "../validates/user.js";
import mongoClient from "../mongoDb/mongoClient.js";
import MongoOptionsFactory from "../models/MongoOptions.js";

const { ObjectId } = mongodb;
const factory = new MongoOptionsFactory();

// Получение данных пользователя по токену(если токен верный)
export const getUser = async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers.authorization, keys.jwt);
    res.status(200).json(new User(decoded));
  } catch (err) {
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
    res.status(401).json(err);
  }
};

// Изменить пароль пользователя
export const changeUserPassword = async (req, res) => {
  const paramsUser = factory.createOptions({
    database: "users",
    filter: { _id: ObjectId(req.headers.userId) },
  });

  const paramsUserChanges = factory.createOptions({
    database: "users",
    filter: { _id: ObjectId(req.headers.userId) },
    operator: {
      $set: {
        password: bcrypt.hashSync(req.body.newPassword, bcrypt.genSaltSync(10)),
      },
    },
  });

  try {
    const user = await mongoClient.getDocument(paramsUser);

    // Проверки
    const err = validate.changeUserPassword(user, req);
    if (err) return res.status(err.status).json(err.data);

    await mongoClient.updateDocument(paramsUserChanges);

    res.status(200).json({
      message: "Пароль изменен!",
    });
  } catch (err) {
    res.status(500).json(err);
  }
};
