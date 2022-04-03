import { Router } from "express";
import registration from "../controllers/reg.js";

const router = Router();

/**
 * Регистрация
 * @param {string} name - Имя пользователя
 * @param {string} email - Почта пользователя
 */
router.post("/sign", registration.create);

/**
 * Подтверждение регистрации
 * @param {string} email - Почта пользователя
 * @param {string} password - Пароль из письма
 */
router.post("/confirm-sign", registration.confirm);

export default router;
