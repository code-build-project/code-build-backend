import { Router } from "express";
import { getCourses, addLikeCourse, deleteLikeCourse } from "../models/courses.js";

const router = Router();

// Получение списка курсов, с фильтром по тегу 
router.get("/courses", (req, res) => {

  getCourses("tags", req.query.tag)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(401).json({
        message: `Ошибка: ${err}`,
      });
    });
});

// Получение курсов которые лайкнул пользователь
router.get("/courses/favorites", (req, res) => {

  getCourses("likes", req.query.userId)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(401).json({
        message: `Ошибка: ${err}`,
      });
    });
});

// Добавление в список лайков, нового юзера
router.post("/courses/add-like", (req, res) => {
  addLikeCourse(req.body.courseId, req.body.userId)
    .then((response) => {
      res.send(response.value);
    })
    .catch(() => {
      console.log("Пидор");
    });
});

// Удаление юзера из списка лайков
router.post("/courses/delete-like", (req, res) => {
  deleteLikeCourse(req.body.courseId, req.body.userId)
    .then((response) => {
      res.send(response.value);
    })
    .catch(() => {
      console.log("Пидор");
    });
});

export default router;
