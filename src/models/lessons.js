import mongodb from "mongodb";
import mongoClient from "../mongoDb/mongoClient.js";

const { ObjectId } = mongodb;

class Parameters {
  constructor(filter = {}, operator = {}) {
    this.filter = filter;
    this.operator = operator;
  }
}

// Получение видеоуроков из указанной коллекции
export const getCourseLessons = (req, res) => {
  const parameters = new Parameters();

  mongoClient.getCollection('lessons', req.query.courseName, parameters)
    .then(data => res.send(data))
    .catch((err) => {
      res.status(401).json({
        message: `Ошибка: ${err}`,
      });
    });
}

// Получение всех видеоуроков из всех коллекций
export const getFavoriteLessons = (req, res) => {
  const parameters = new Parameters({ likes: req.query.userId });

  mongoClient.getDatabase('lessons', parameters)
    .then(data => res.send(data))
    .catch((err) => {
      res.status(401).json({
        message: `Ошибка: ${err}`,
      });
    });
}

// Добавить данного юзера в список лайков видеоуроков
export const addLikeLesson = (req, res) => {
  const parameters = new Parameters(
    { _id:  ObjectId(req.body.lessonId) }, 
    { $push: {likes: req.body.userId} }
  );

  mongoClient.updateDocument("lessons", req.body.courseName, parameters)
    .then(data => res.send(data.value))
    .catch((err) => {
      res.status(401).json({
        message: `Ошибка: ${err}`,
      });
    });
};

// Удалить данного юзера из списка лайков видеоуроков
export const deleteLikeLesson = (lessonId, userId, collectionName) => {
  const parameters = new Parameters(
    { _id:  ObjectId(req.body.lessonId) }, 
    { $pull: {likes: req.body.userId} }
  );

  mongoClient.updateDocument("lessons", req.body.courseName, parameters)
    .then(data => res.send(data.value))
    .catch((err) => {
      res.status(401).json({
        message: `Ошибка: ${err}`,
      });
    });
};