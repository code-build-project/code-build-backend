import { Router } from "express";
import {
  getCourseLessons,
  getFavoriteLessons,
} from "../controllers/lessons.js";

const router = Router();

// Получение списка уроков указанного курса
router.get("/lessons", getCourseLessons);

// Получение уроков которые лайкнул пользователь
router.get("/lessons/favorites", getFavoriteLessons);

export default router;
