import bcrypt from "bcryptjs";
import mongodb from "mongodb";
import User from "../models/User.js";
import validator from "../validators/users.js";
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
      filter: { _id: ObjectId(res.locals.user.id) },
      operator: {
        $set: {
          name: req.body.name,
        },
      },
    };
  
    try {
      validator.isName(req.body.name);
      validator.formatName(req.body.name);
      validator.maxLengthName(req.body.name.length, 20);
  
      await Controller.service.updateDocument(paramsUserChanges);

      const token = createToken({
        id: res.locals.user.id,
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
      filter: { _id: ObjectId(res.locals.user.id) },
      operator: {
        $set: {
          password: bcrypt.hashSync(req.body.newPassword, bcrypt.genSaltSync(10)),
        },
      },
    };
  
    try {
      validator.isOldPassword(req.body.oldPassword);
      validator.correctPassword(req.body.oldPassword, res.locals.user.password);
      validator.minLengthPassword(req.body.newPassword.length);
      validator.maxLengthPassword(req.body.newPassword.length);
      validator.hasGapsPassword(req.body.newPassword);
      validator.hasInvalidCharacters(req.body.newPassword);
      validator.matchPasswords(req.body.oldPassword, req.body.newPassword);
  
      await Controller.service.updateDocument(paramsUserChanges);
      
      const token = createToken({
        id: res.locals.user.id,
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