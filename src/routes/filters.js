import { Router } from "express";
import { getArticleFilters, getCourseFilters } from "../controllers/filters.js";

const router = Router();

// Получение списка фильтров для страницы "Блог"
router.get("/filters/articles", getArticleFilters);

// Получение списка фильтров для страницы "Видеокурсы"
router.get("/filters/courses", getCourseFilters);

export default router;
