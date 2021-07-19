import mongodb from "mongodb";
import mongoClient from "../mongoDb/mongoClient.js";
import { Parameters, Lesson } from "../models/Lessons.js";

const { ObjectId } = mongodb;

// Получение видеоуроков из указанной коллекции
export const getCourseLessons = (req, res) => {
  const params = new Parameters("lessons", req.query.courseName, {}, {});

  mongoClient
    .getCollection(params)
    .then((data) => {
      const lessons = data.map((item) => new Lesson(item));
      res.send(lessons);
    })
    .catch((err) => {
      res.status(401).json({
        message: `Ошибка: ${err}`,
      });
    });
};

// Получение понравившехся видеоуроков из всех коллекций
export const getFavoriteLessons = (req, res) => {
  const params = new Parameters(
    "lessons",
    undefined,
    { likes: req.query.userId },
    {}
  );

  mongoClient
    .getDatabase(params)
    .then((data) => {
      const lessons = data.map((item) => new Lesson(item));
      res.send(lessons);
    })
    .catch((err) => {
      res.status(401).json({
        message: `Ошибка: ${err}`,
      });
    });
};

// Добавить данного юзера в список лайков видеоуроков
export const addLikeLesson = (req, res) => {
  const params = new Parameters(
    "lessons",
    req.body.courseName,
    { _id: ObjectId(req.body.lessonId) },
    { $push: { likes: req.body.userId } }
  );

  mongoClient
    .updateDocument(params)
    .then((data) => res.send(data.value))
    .catch((err) => {
      res.status(401).json({
        message: `Ошибка: ${err}`,
      });
    });
};

// Удалить данного юзера из списка лайков видеоуроков
export const deleteLikeLesson = (req, res) => {
  const params = new Parameters(
    "lessons",
    req.body.courseName,
    { _id: ObjectId(req.body.lessonId) },
    { $pull: { likes: req.body.userId } }
  );

  mongoClient
    .updateDocument(params)
    .then((data) => res.send(data.value))
    .catch((err) => {
      res.status(401).json({
        message: `Ошибка: ${err}`,
      });
    });
};
