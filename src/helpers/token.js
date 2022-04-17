import jwt from "jsonwebtoken";
import keys from "../config/keys.js";

/**
 * Создание токена
 * @param {object} user - данные пользователя для шифрования в токен
 */
export const createToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isPremium: user.isPremium,
      password: user.password,
    },
    keys.jwt,
    { expiresIn: 21600 }
  );
};

/**
 * Проверка токена
 * @param {string} token - токен
 */
export const verifyToken = (token) => {
  return jwt.verify(token, keys.jwt);
};