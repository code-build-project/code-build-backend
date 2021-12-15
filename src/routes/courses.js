import { Router } from "express";
import { 
  getCourseList, 
  getCourse,
  getFavoriteCourseList, 
  addLikeCourse, 
  deleteLikeCourse 
} from "../controllers/courses.js";

const router = Router();

// Получение списка курсов, с фильтром по тегу 
router.get("/courses", getCourseList);

// Получение однго курса по id
router.get("/course", getCourse);

// Получение курсов которые лайкнул пользователь
router.get("/courses/favorites", getFavoriteCourseList);

// Добавление в список лайков, нового юзера
router.post("/courses/add-like", addLikeCourse);

// Удаление юзера из списка лайков
router.post("/courses/delete-like", deleteLikeCourse);

export default router;
