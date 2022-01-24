import { Lesson } from "../models/Lessons.js";
import mongoClient from "../mongoDb/mongoClient.js";
import MongoOptionsFactory from "../models/MongoOptions.js";

const factory = new MongoOptionsFactory();

// Получение видеоуроков из указанной коллекции
export const getCourseLessons = async (req, res) => {
  const params = factory.createOptions({
    database: "lessons",
    collection: req.query.courseId,
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
    filter: { likes: req.headers.userId },
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