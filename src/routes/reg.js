import { Router } from "express";
import {
  registration,
  completionRegistration,
  recovery,
} from "../controllers/reg.js";

const router = Router();

// Регистрация
router.post("/sign", registration);

// Подтверждение регистрации
router.post("/completion-registration", completionRegistration);

// Восстановление пароля
router.post("/recovery-password", recovery);

export default router;