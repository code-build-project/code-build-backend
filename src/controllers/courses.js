import mongodb from "mongodb";
import { Course } from "../models/Courses.js";
import mongoClient from "../mongoDb/mongoClient.js";
import MongoOptionsFactory from "../models/MongoOptions.js";

const { ObjectId } = mongodb;
const factory = new MongoOptionsFactory();

// Получение всех курсов
export const getCourses = (req, res) => {
  const params = factory.createOptions({
    database: "courses",
    filter: { tags: req.query.tag },
  });

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
  const params = factory.createOptions({
    database: "courses",
    filter: { likes: req.query.userId },
  });

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
  const params = factory.createOptions({
    database: "courses",
    filter: { _id: ObjectId(req.body.courseId) },
    operator: { $push: { likes: req.body.userId } }
  });

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
  const params = factory.createOptions({
    database: "courses",
    filter: { _id: ObjectId(req.body.courseId) },
    operator: { $pull: { likes: req.body.userId } }
  });

  mongoClient
    .updateDocument(params)
    .then((response) => res.send(response.value))
    .catch((err) => {
      res.status(401).json({
        message: `Ошибка: ${err}`,
      });
    });
};
