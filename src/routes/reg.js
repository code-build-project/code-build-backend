import { Router } from "express";
import { registration, completionRegistration } from "../controllers/reg.js";

const router = Router();

// Регистрация
router.post("/sign", registration);
router.post("/completion-registration", completionRegistration);

export default router;
