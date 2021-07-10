import { Router } from "express";
import { getArticleFilters, getCourseFilters } from "../models/filters.js";

const router = Router();

// Получение списка фильтров для страницы "Блог"
router.get("/filters/articles", (req, res) => {

  getArticleFilters()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(401).json({
        message: `Ошибка: ${err}`,
      });
    });
});

// Получение списка фильтров для страницы "Видеокурсы"
router.get("/filters/courses", (req, res) => {
  getCourseFilters()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(401).json({
        message: `Ошибка: ${err}`,
      });
    });
});

export default router;
