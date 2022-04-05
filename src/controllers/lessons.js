import { Lesson } from "../models/Lessons.js";
import mongoClient from "../mongoDb/mongoClient.js";
import MongoOptionsFactory from "../models/MongoOptions.js";

const factory = new MongoOptionsFactory();

export default class Lessons {
  // Получение видеоуроков из указанной коллекции
  static async getCourseLessons(req, res) {
    const params = factory.createOptions({
      database: "lessons",
      collection: req.query.courseId,
    });

    try {
      const response = await mongoClient.getCollection(params);
      res.send(response.map((item) => new Lesson(item)));
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // Получение понравившехся видеоуроков из всех коллекций
  static async getFavoriteLessons(req, res) {
    const paramsLikes = factory.createOptions({
      database: "likes",
      collection: "lessons",
      filter: { userId: res.locals.user._id },
    });

    try {
      const { likes = [] } = (await mongoClient.getDocument(paramsLikes)) || {};

      const paramsLessons = factory.createOptions({
        database: "lessons",
        filter: { id: { $in: likes } },
      });

      const response = await mongoClient.getDatabase(paramsLessons);
      res.send(response.map((item) => new Lesson(item)));
    } catch (err) {
      res.status(500).json(err);
    }
  }
}