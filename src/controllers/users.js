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

export default class Users {
  // Получение данных пользователя по токену(если токен верный)
  static get(req, res) {
    try {
      res.status(200).json(new User(res.locals.user));
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // Изменить имя пользователя
  static async changeName(req, res) {
    const paramsUserChanges = factory.createOptions({
      database: "users",
      filter: { _id: ObjectId(res.locals.user._id) },
      operator: {
        $set: {
          name: req.body.name,
        },
      },
    });
  
    try {
      const err = validate.changeUserName(req);
      if (err) return res.status(err.status).json(err.data);
  
      let response = await mongoClient.updateDocument(paramsUserChanges);
      response = new User(response.value);
  
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
  }

  // Изменить пароль пользователя
  static async changePassword() {
    const paramsUserChanges = factory.createOptions({
      database: "users",
      filter: { _id: ObjectId(res.locals.user._id) },
      operator: {
        $set: {
          password: bcrypt.hashSync(req.body.newPassword, bcrypt.genSaltSync(10)),
        },
      },
    });
  
    try {
      const err = validate.changeUserPassword(req, res);
      if (err) return res.status(err.status).json(err.data);
  
      await mongoClient.updateDocument(paramsUserChanges);
  
      const token = jwt.sign(
        {
          _id: res.locals.user._id,
          name: res.locals.user.name,
          email: res.locals.user.email,
          isPremium: res.locals.user.isPremium,
          password: req.body.newPassword,
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
  }
}