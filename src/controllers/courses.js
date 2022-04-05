import { Course } from "../models/Courses.js";
import mongoClient from "../mongoDb/mongoClient.js";
import MongoOptionsFactory from "../models/MongoOptions.js";

const factory = new MongoOptionsFactory();

export default class Courses {
  // Получение одного курса по id
  static async getCourse(req, res) {
    const params = factory.createOptions({
      database: "courses",
      filter: { id: req.query.id },
    });

    try {
      const response = await mongoClient.getDocument(params);
      res.send(new Course(response));
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // Получение всех курсов
  static async getCourseList(req, res) {
    const params = factory.createOptions({
      database: "courses",
      filter: req.query.tag ? { tags: req.query.tag } : {},
    });

    try {
      const response = await mongoClient.getCollection(params);
      res.send(response.map((item) => new Course(item)));
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // Получение курсов которые лайкнул пользователь
  static async getFavoriteCourseList(req, res) {
    const paramsLikes = factory.createOptions({
      database: "likes",
      collection: "courses",
      filter: { userId: res.locals.user._id },
    });

    try {
      const { likes = [] } = (await mongoClient.getDocument(paramsLikes)) || {};

      const paramsCourses = factory.createOptions({
        database: "courses",
        filter: { id: { $in: likes } },
      });

      const response = await mongoClient.getCollection(paramsCourses);
      res.send(response.map((item) => new Course(item)));
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // Получить популярные рекомендации по курсам
  static async getPopularCourseList(req, res) {
    const params = factory.createOptions({
      database: "courses",
      size: 3,
    });

    try {
      const response = await mongoClient.getRandomCollection(params);

      let array = response.filter((item) => item.id !== req.query.id);
      if (array.length > 3) array.pop();

      res.send(array.map((item) => new Course(item)));
    } catch (err) {
      res.status(500).json(err);
    }
  }
}