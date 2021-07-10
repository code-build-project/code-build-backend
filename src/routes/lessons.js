import { Router } from "express";
import { getAllLessons, getCourseLessons, addLikeLesson, deleteLikeLesson } from "../models/lessons.js";

const router = Router();

// Получение списка уроков указанного курса
router.get("/lessons", (req, res) => {
  getCourseLessons(req.query.courseName)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(401).json({
        message: `Ошибка: ${err}`,
      });
    });
});

// Получение уроков которые лайкнул пользователь
router.get("/lessons/favorites", (req, res) => {
  getAllLessons("likes", req.query.userId)
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
router.post("/lessons/add-like", (req, res) => {
  addLikeLesson(req.body.lessonId, req.body.userId, req.body.courseName)
    .then((response) => {
      res.send(response.value);
    })
    .catch(() => {
      console.log("Пидор");
    });
});

// Удаление юзера из списка лайков
router.post("/lessons/delete-like", (req, res) => {
  deleteLikeLesson(req.body.lessonId, req.body.userId, req.body.courseName)
    .then((response) => {
      res.send(response.value);
    })
    .catch(() => {
      console.log("Пидор");
    });
});


export default router;
