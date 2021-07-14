import { Router } from "express";
import { registration } from "../controllers/reg.js";

const router = Router();

// Регистрация
router.post("/sign", registration);

export default router;
