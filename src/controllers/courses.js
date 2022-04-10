import { Course } from "../models/Courses.js";
import Controller from "../controllers/AbstractController.js";

export default class Courses extends Controller {
  // Получение одного курса по id
  static async getCourse(req, res) {
    const params = Controller.createOptions({
      database: "courses",
      filter: { id: req.query.id },
    });

    try {
      const response = await Controller.service.getDocument(params);
      res.send(new Course(response));
    } catch (err) {
      Controller.errorHandler(res, err);
    }
  }

  // Получение всех курсов
  static async getCourseList(req, res) {
    const params = Controller.createOptions({
      database: "courses",
      filter: req.query.tag ? { tags: req.query.tag } : {},
    });

    try {
      const response = await Controller.service.getCollection(params);
      res.send(response.map((item) => new Course(item)));
    } catch (err) {
      Controller.errorHandler(res, err);
    }
  }

  // Получение курсов которые лайкнул пользователь
  static async getFavoriteCourseList(req, res) {
    const paramsLikes = Controller.createOptions({
      database: "likes",
      collection: "courses",
      filter: { userId: res.locals.user._id },
    });

    try {
      const { likes = [] } = (await Controller.service.getDocument(paramsLikes)) || {};

      const paramsCourses = Controller.createOptions({
        database: "courses",
        filter: { id: { $in: likes } },
      });

      const response = await Controller.service.getCollection(paramsCourses);
      res.send(response.map((item) => new Course(item)));
    } catch (err) {
      Controller.errorHandler(res, err);
    }
  }

  // Получить популярные рекомендации по курсам
  static async getPopularCourseList(req, res) {
    const params = Controller.createOptions({
      database: "courses",
      size: 3,
    });

    try {
      const response = await Controller.service.getRandomCollection(params);

      let array = response.filter((item) => item.id !== req.query.id);
      if (array.length > 3) array.pop();

      res.send(array.map((item) => new Course(item)));
    } catch (err) {
      Controller.errorHandler(res, err);
    }
  }
}