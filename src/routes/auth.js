import { Router } from "express";
import auth from "../controllers/auth.js";

const router = Router();

/**
 * Авторизация с возвратом токена
 * @param {string} email - Почта пользователя
 * @param {string} password - Пароль из письма
 */
router.post('/login', auth.login);

/**
 * Восстановление пароля
 * @param {string} email - Почта пользователя
 */
router.post("/recovery-password", auth.recovery);

export default router;