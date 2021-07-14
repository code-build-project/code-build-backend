import { Router } from "express";
import { 
  getCourses, 
  getFavoriteCourses, 
  addLikeCourse, 
  deleteLikeCourse 
} from "../controllers/courses.js";

const router = Router();

// Получение списка курсов, с фильтром по тегу 
router.get("/courses", getCourses);

// Получение курсов которые лайкнул пользователь
router.get("/courses/favorites", getFavoriteCourses);

// Добавление в список лайков, нового юзера
router.post("/courses/add-like", addLikeCourse);

// Удаление юзера из списка лайков
router.post("/courses/delete-like", deleteLikeCourse);

export default router;
