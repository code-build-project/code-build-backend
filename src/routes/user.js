import { Router } from "express";
import { getUser } from "../controllers/user.js";

const router = Router();

// Получение данных авторизированного пользователя
router.get('/user', getUser);

export default router;
