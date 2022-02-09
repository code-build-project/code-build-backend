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
  const paramsLikes = factory.createOptions({
    database: "likes",
    collection: "lessons",
    filter: { userId: req.headers.userId },
  });

  try {
    const { likes } = await mongoClient.getDocument(paramsLikes);

    const paramsLessons = factory.createOptions({
      database: "lessons",
      filter: { id: { $in: likes } },
    });

    const response = await mongoClient.getDatabase(paramsLessons);
    res.send(response.map((item) => new Lesson(item)));
  } catch (err) {
    res.status(401).json({
      message: `Ошибка: ${err}`,
    });
  }
};
