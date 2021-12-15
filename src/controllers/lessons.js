import { Lesson } from "../models/Lessons.js";
import mongoClient from "../mongoDb/mongoClient.js";
import MongoOptionsFactory from "../models/MongoOptions.js";

const factory = new MongoOptionsFactory();

// Получение видеоуроков из указанной коллекции
export const getCourseLessons = async (req, res) => {
  const params = factory.createOptions({
    database: "lessons",
    collection: req.query.courseName,
  });

  try {
    const response = await mongoClient.getCollection(params);
    res.send(response.map((item) => new Lesson(item)));
  } catch (err) {
    res.status(401).json({
      message: `Ошибка: ${err}`,
    });
  }
};

// Получение понравившехся видеоуроков из всех коллекций
export const getFavoriteLessons = async (req, res) => {
  const params = factory.createOptions({
    database: "lessons",
    filter: { likes: req.query.userId },
  });

  try {
    const response = await mongoClient.getDatabase(params);
    res.send(response.map((item) => new Lesson(item)));
  } catch (err) {
    res.status(401).json({
      message: `Ошибка: ${err}`,
    });
  }
};

// Добавить данного юзера в список лайков видеоуроков
export const addLikeLesson = async (req, res) => {
  const params = factory.createOptions({
    database: "lessons",
    collection: req.body.courseName,
    filter: { id: req.body.lessonId },
    operator: { $push: { likes: req.body.userId } },
  });

  try {
    const response = await mongoClient.updateDocument(params);
    res.send(response.value);
  } catch (err) {
    res.status(401).json({
      message: `Ошибка: ${err}`,
    });
  }
};

// Удалить данного юзера из списка лайков видеоуроков
export const deleteLikeLesson = async (req, res) => {
  const params = factory.createOptions({
    database: "lessons",
    collection: req.body.courseName,
    filter: { id: req.body.lessonId },
    operator: { $pull: { likes: req.body.userId } },
  });

  try {
    const response = await mongoClient.updateDocument(params);
    res.send(response.value);
  } catch (err) {
    res.status(401).json({
      message: `Ошибка: ${err}`,
    });
  }
};
