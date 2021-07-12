import mongodb from "mongodb";
import mongoClient from "../mongoDb/mongoClient.js";

const { ObjectId } = mongodb;

class Parameters {
  constructor(filter = {}, operator = {}) {
    this.filter = filter;
    this.operator = operator;
  }
}


// Получение всех курсов
export const getCourses = (req, res) => {
  const parameters = new Parameters({ tags: req.query.tag });

  mongoClient.getCollection('courses', 'courses', parameters)
    .then(data => res.send(data))
    .catch((err) => {
      res.status(401).json({
        message: `Ошибка: ${err}`,
      });
    });
}

// Получение курсов которые лайкнул пользователь
export const getFavoriteCourses = (req, res) => {
  const parameters = new Parameters({ likes: req.query.userId });

  mongoClient.getCollection('articles', 'articles', parameters)
    .then(data => res.send(data))
    .catch((err) => {
      res.status(401).json({
        message: `Ошибка: ${err}`,
      });
    });
}

// Добавить данного юзера в список лайков курса
export const addLikeCourse = (req, res) => {
  const parameters = new Parameters(
    { _id: ObjectId(req.body.courseId) }, 
    { $push: {likes: req.body.userId} },
  );

  mongoClient.updateDocument("courses", "courses", parameters)
    .then((response) => res.send(response.value))
    .catch((err) => {
      res.status(401).json({
        message: `Ошибка: ${err}`,
      });
    });
};

// Удалить данного юзера из списка лайков курса
export const deleteLikeCourse = (req, res) => {
  const parameters = new Parameters(
    { _id: ObjectId(req.body.courseId) }, 
    { $pull: {likes: req.body.userId} },
  );


  mongoClient.updateDocument("courses", "courses", parameters)
    .then((response) => res.send(response.value))
    .catch((err) => {
      res.status(401).json({
        message: `Ошибка: ${err}`,
      });
    });
};