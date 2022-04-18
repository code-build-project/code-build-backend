import { Router } from "express";
import Users from "../controllers/users.js";

const router = Router();

/**
 * Получение данных авторизированного пользователя
 */
router.get("/user", Users.get);

/**
 * Изменить имя пользователя
 * @param {string} name - Новое имя пользователя
 */
router.put("/user/change-name", Users.changeName);

/**
 * Изменить пароль пользователя
 * @param {string} oldPassword - Текущий пароль пользователя
 * @param {string} newPassword - Новый пароль пользователя
 */
router.put("/user/change-password", Users.changePassword);

export default router;