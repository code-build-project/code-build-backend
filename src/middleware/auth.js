import bcrypt from "bcryptjs";
import mongodb from "mongodb";
import { verifyToken } from "../helpers/token.js";
import { MessageError } from "../models/Errors.js";
import service from "../mongoDb/mongoClient.js";

const { ObjectId } = mongodb;
const protectedRoutes = [
  "/user",
  "/user/change-name",
  "/user/change-password",
  "/likes",
  "/likes/add",
  "/likes/delete",
  "/articles/favorites",
  "/courses/favorites",
  "/lessons/favorites",
];

// Проверка доступа пользователя
export default async (req, res, next) => {
  if (protectedRoutes.includes(req.path)) {
    //Токен валидный, передаём запрос дальше
    try {
      const decode = verifyToken(req.headers.authorization);
      const params = {
        database: "users",
        collection: "users",
        filter: { _id: ObjectId(decode._id) },
      };
      const user = await service.getDocument(params);
      const isValidPassword = bcrypt.compareSync(decode.password, user.password);
    
      if (!isValidPassword) {
        const err = new MessageError('JsonWebTokenError', 'invalid token', 401);
        return res.status(err.status).json(err.data);
      }
      
      res.locals.user = {...user, password: decode.password };
      next();
    } catch (err) {
      // Неверный токен, возвращаем ошибку
      res.status(401).json(err);
    }
  } else {
    next();
  }
};
