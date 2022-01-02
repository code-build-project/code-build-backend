import jwt from "jsonwebtoken";
import keys from "../config/keys.js";

// Проверка доступа пользователя
export default (req, res, next) => {
  if (req.headers.authorization) {
    //Токен валидный, передаём запрос дальше
    try {
      const user = jwt.verify(req.headers.authorization, keys.jwt);
      req.headers.userId = user.id;
      return next();
    } catch (err) {
      // Неверный токен, возвращаем ошибку
      res.status(401).json({
        message: `Ошибка: ${err}`,
      });
    }
  }
  next();
};
