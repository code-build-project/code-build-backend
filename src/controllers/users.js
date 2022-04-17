import bcrypt from "bcryptjs";
import mongodb from "mongodb";
import { User } from "../models/Users.js";
import validate from "../validates/users.js";
import { createToken } from "../helpers/token.js";
import Controller from "../controllers/AbstractController.js";

const { ObjectId } = mongodb;

export default class Users extends Controller {
  // Получение данных пользователя по токену(если токен верный)
  static get(req, res) {
    try {
      res.status(200).json(new User(res.locals.user));
    } catch (err) {
      Controller.errorHandler(res, err);
    }
  }

  // Изменить имя пользователя
  static async changeName(req, res) {
    const paramsUserChanges = {
      database: "users",
      collection: "users",
      filter: { _id: ObjectId(res.locals.user._id) },
      operator: {
        $set: {
          name: req.body.name,
        },
      },
    };
  
    try {
      validate.changeUserName(req);
  
      await Controller.service.updateDocument(paramsUserChanges);

      const token = createToken({
        _id: res.locals.user._id,
        name: req.body.name,
        email: res.locals.user.email,
        isPremium: res.locals.user.isPremium,
        password: res.locals.user.password,
      });
  
      res.status(200).json({ token: `Bearer ${token}` });
    } catch (err) {
      Controller.errorHandler(res, err);
    }
  }

  // Изменить пароль пользователя
  static async changePassword(req, res) {
    const paramsUserChanges = {
      database: "users",
      collection: "users",
      filter: { _id: ObjectId(res.locals.user._id) },
      operator: {
        $set: {
          password: bcrypt.hashSync(req.body.newPassword, bcrypt.genSaltSync(10)),
        },
      },
    };
  
    try {
      validate.changeUserPassword(req, res);
  
      await Controller.service.updateDocument(paramsUserChanges);
      
      const token = createToken({
        _id: res.locals.user._id,
        name: res.locals.user.name,
        email: res.locals.user.email,
        isPremium: res.locals.user.isPremium,
        password: req.body.newPassword,
      });

      res.status(200).json({ token: `Bearer ${token}` });
    } catch (err) {
      Controller.errorHandler(res, err);
    }
  }
}