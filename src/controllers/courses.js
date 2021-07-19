import mongodb from "mongodb";
import mongoClient from "../mongoDb/mongoClient.js";
import { Parameters, Course } from "../models/Courses.js";

const { ObjectId } = mongodb;

// Получение всех курсов
export const getCourses = (req, res) => {
  const params = new Parameters(
    "courses",
    "courses",
    { tags: req.query.tag },
    {}
  );

  mongoClient
    .getCollection(params)
    .then((data) => {
      const courses = data.map((item) => new Course(item));
      res.send(courses);
    })
    .catch((err) => {
      res.status(401).json({
        message: `Ошибка: ${err}`,
      });
    });
};

// Получение курсов которые лайкнул пользователь
export const getFavoriteCourses = (req, res) => {
  const params = new Parameters(
    "courses",
    "courses",
    { likes: req.query.userId },
    {}
  );

  mongoClient
    .getCollection(params)
    .then((data) => {
      const courses = data.map((item) => new Course(item));
      res.send(courses);
    })
    .catch((err) => {
      res.status(401).json({
        message: `Ошибка: ${err}`,
      });
    });
};

// Добавить данного юзера в список лайков курса
export const addLikeCourse = (req, res) => {
  const params = new Parameters(
    "courses",
    "courses",
    { _id: ObjectId(req.body.courseId) },
    { $push: { likes: req.body.userId } }
  );

  mongoClient
    .updateDocument(params)
    .then((response) => res.send(response.value))
    .catch((err) => {
      res.status(401).json({
        message: `Ошибка: ${err}`,
      });
    });
};

// Удалить данного юзера из списка лайков курса
export const deleteLikeCourse = (req, res) => {
  const params = new Parameters(
    "courses",
    "courses",
    { _id: ObjectId(req.body.courseId) },
    { $pull: { likes: req.body.userId } }
  );

  mongoClient
    .updateDocument(params)
    .then((response) => res.send(response.value))
    .catch((err) => {
      res.status(401).json({
        message: `Ошибка: ${err}`,
      });
    });
};
