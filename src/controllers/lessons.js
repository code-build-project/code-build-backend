import { Lesson } from "../models/Lessons.js";
import Controller from "../controllers/AbstractController.js";

export default class Lessons extends Controller {
  // Получение видеоуроков из указанной коллекции
  static async getCourseLessons(req, res) {
    const params = Controller.createOptions({
      database: "lessons",
      collection: req.query.courseId,
    });

    try {
      const response = await Controller.service.getCollection(params);
      res.send(response.map((item) => new Lesson(item)));
    } catch (err) {
      Controller.errorHandler(res, err);
    }
  }

  // Получение понравившехся видеоуроков из всех коллекций
  static async getFavoriteLessons(req, res) {
    const paramsLikes = Controller.createOptions({
      database: "likes",
      collection: "lessons",
      filter: { userId: res.locals.user._id },
    });

    try {
      const { likes = [] } = (await Controller.service.getDocument(paramsLikes)) || {};

      const paramsLessons = Controller.createOptions({
        database: "lessons",
        filter: { id: { $in: likes } },
      });

      const response = await Controller.service.getDatabase(paramsLessons);
      res.send(response.map((item) => new Lesson(item)));
    } catch (err) {
      Controller.errorHandler(res, err);
    }
  }
}