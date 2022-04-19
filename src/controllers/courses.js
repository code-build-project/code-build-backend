import Course from "../models/Course.js";
import validator from "../validators/courses.js";
import Controller from "../controllers/abstractController.js";

export default class Courses extends Controller {
  // Получение одного курса по id
  static async getCourse(req, res) {
    const params = {
      database: "courses",
      collection: "courses",
      filter: { id: req.query.id },
    };

    try {
      validator.isId(req.query.id);

      const response = await Controller.service.getDocument(params);

      validator.isCourse(response);
      res.send(new Course(response));
    } catch (err) {
      Controller.errorHandler(res, err);
    }
  }

  // Получение всех курсов
  static async getCourseList(req, res) {
    const params = {
      database: "courses",
      collection: "courses",
      filter: req.query.tag ? { tags: req.query.tag } : {},
    };

    try {
      const response = await Controller.service.getCollection(params);
      res.send(response.map((item) => new Course(item)));
    } catch (err) {
      Controller.errorHandler(res, err);
    }
  }

  // Получение курсов которые лайкнул пользователь
  static async getFavoriteCourseList(req, res) {
    const paramsLikes = {
      database: "likes",
      collection: "courses",
      filter: { userId: res.locals.user.id },
    };

    try {
      const { likes = [] } = (await Controller.service.getDocument(paramsLikes)) || {};

      const paramsCourses = {
        database: "courses",
        collection: "courses",
        filter: { id: { $in: likes } },
      };

      const response = await Controller.service.getCollection(paramsCourses);
      res.send(response.map((item) => new Course(item)));
    } catch (err) {
      Controller.errorHandler(res, err);
    }
  }

  // Получить рандомно, популярные курсы
  static async getPopularCourseList(req, res) {
    const params = {
      database: "courses",
      collection: "courses",
      size: 3,
    };

    try {
      const response = await Controller.service.getRandomDocumentList(params);

      let array = response.filter((item) => item.id !== req.query.id);
      if (array.length > 3) array.pop();

      res.send(array.map((item) => new Course(item)));
    } catch (err) {
      Controller.errorHandler(res, err);
    }
  }
}