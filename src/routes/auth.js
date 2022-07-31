import { Router } from "express";
import Auth from "../controllers/auth.js";

const router = Router();

/**
 * Авторизация с возвратом токена
 * @param {string} email - Почта пользователя
 * @param {string} password - Пароль из письма
 */
router.post("/login", Auth.login);

/**
 * Восстановление пароля
 * @param {string} email - Почта пользователя
 */
router.post("/login/recovery", Auth.recovery);

export default router;