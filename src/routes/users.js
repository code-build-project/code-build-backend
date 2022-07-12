import { Router } from "express";
import Users from "../controllers/users.js";

const router = Router();

/**
 * Получение данных авторизированного пользователя
 */
router.get("/user", Users.get);

/**
 * Изменить данные пользователя
 * @param {string} name - Новое имя пользователя
 * @param {boolean} isChangePassword - Флаг на изменение пароля
 * @param {string} oldPassword - Текущий пароль пользователя
 * @param {string} newPassword - Новый пароль пользователя
 */
router.put("/user/change", Users.change);

export default router;