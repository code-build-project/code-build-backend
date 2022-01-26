import { Router } from "express";
import registration from "../controllers/reg.js";

const router = Router();

// Регистрация
router.post("/sign", registration.create);

// Подтверждение регистрации
router.post("/confirm-sign", registration.confirm);

export default router;
