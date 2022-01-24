import { Router } from "express";
import { getUser, changeUserName } from "../controllers/users.js";

const router = Router();

// Получение данных авторизированного пользователя
router.get("/user", getUser);

// Изменить имя пользователя
router.put("/user/change-name", changeUserName);

export default router;
