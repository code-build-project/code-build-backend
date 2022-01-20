import { Router } from "express";
import auth from "../controllers/auth.js";

const router = Router();

// Авторизация с возвратом токена
router.post('/login', auth.login);

// Восстановление пароля
router.post("/recovery-password", auth.recovery);

export default router;