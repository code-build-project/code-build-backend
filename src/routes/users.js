import { Router } from "express";
import { getUser, changeUserName, changeUserPassword } from "../controllers/users.js";

const router = Router();

// Получение данных авторизированного пользователя
router.get("/user", getUser);

// Изменить имя пользователя
router.put("/user/change-name", changeUserName);

// Изменить пароль пользователя
router.put("/user/change-password", changeUserPassword);

export default router;
