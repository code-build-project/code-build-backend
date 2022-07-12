import jwt from "jsonwebtoken";
import keys from "../config/keys.js";

/**
 * Создание токена
 * @param {object} user - данные пользователя для шифрования в токен
 */
export const createToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            version: user.version,
        },
        keys.jwt,
        { expiresIn: 28800 }
    );
};

/**
 * Проверка токена
 * @param {string} token - токен
 */
export const verifyToken = (token) => {
    return jwt.verify(token, keys.jwt);
};