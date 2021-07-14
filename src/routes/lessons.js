import { Router } from "express";
import {
  getCourseLessons,
  getFavoriteLessons,
  addLikeLesson,
  deleteLikeLesson,
} from "../controllers/lessons.js";

const router = Router();

// Получение списка уроков указанного курса
router.get("/lessons", getCourseLessons);

// Получение уроков которые лайкнул пользователь
router.get("/lessons/favorites", getFavoriteLessons);

// Добавление в список лайков, нового юзера
router.post("/lessons/add-like", addLikeLesson);

// Удаление юзера из списка лайков
router.post("/lessons/delete-like", deleteLikeLesson);

export default router;
