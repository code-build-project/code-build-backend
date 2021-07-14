import { Router } from "express";
import { login } from "../controllers/auth.js";

const router = Router();

// Авторизация с возвратом токена
router.post('/login', login);

export default router;