import jwt from "jsonwebtoken";
import keys from "../config/keys.js";

// Создание токена
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

// Проверка токена
export const verifyToken = (token) => {
  return jwt.verify(token, keys.jwt);
};