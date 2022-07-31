import { Router } from "express";
import Registration from "../controllers/reg.js";

const router = Router();

/**
 * Регистрация
 * @param {string} name - Имя пользователя
 * @param {string} email - Почта пользователя
 */
router.post("/sign", Registration.create);

/**
 * Подтверждение регистрации
 * @param {string} email - Почта пользователя
 * @param {string} password - Пароль из письма
 */
router.post("/sign/confirm", Registration.confirm);

export default router;