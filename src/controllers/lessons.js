import Lesson from "../models/Lesson.js";
import validator from "../validators/lessons.js";
import Controller from "../controllers/abstractController.js";

export default class Lessons extends Controller {
  // Получение видеоуроков из указанной коллекции
  static async getCourseLessons(req, res) {
    const params = {
      database: "lessons",
      collection: req.query.courseId,
    };

    try {
      validator.isCourseId(req.query.courseId);

      const response = await Controller.service.getCollection(params);
      res.send(response.map((item) => new Lesson(item)));
    } catch (err) {
      Controller.errorHandler(res, err);
    }
  }

  // Получение понравившехся видеоуроков из всех коллекций
  static async getFavoriteLessons(req, res) {
    const paramsLikes = {
      database: "likes",
      collection: "lessons",
      filter: { userId: res.locals.user.id },
    };

    try {
      const { likes = [] } = (await Controller.service.getDocument(paramsLikes)) || {};

      const paramsLessons = {
        database: "lessons",
        filter: { id: { $in: likes } },
      };

      const response = await Controller.service.getDatabase(paramsLessons);
      res.send(response.map((item) => new Lesson(item)));
    } catch (err) {
      Controller.errorHandler(res, err);
    }
  }
}