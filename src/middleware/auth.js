import jwt from "jsonwebtoken";
import keys from "../config/keys.js";

const accessRoutes = [
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
export default (req, res, next) => {
  if (accessRoutes.includes(req.path)) {
    //Токен валидный, передаём запрос дальше
    try {
      const user = jwt.verify(req.headers.authorization, keys.jwt);
      req.headers.userId = user._id;
      next();
    } catch (err) {
      // Неверный токен, возвращаем ошибку
      res.status(401).json(err);
    }
  } else {
    next();
  }
};
