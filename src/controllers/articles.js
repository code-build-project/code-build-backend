import { Article } from "../models/Articles.js";
import validate from "../validates/articles.js";
import Controller from "../controllers/AbstractController.js";

export default class Articles extends Controller {
  // Получить одну статью по id
  static async getArticle(req, res) {
    validate.getArticle(req);

    const params = Controller.createOptions({
      database: "articles",
      filter: { id: req.query.id },
    });

    try {
      const response = await Controller.service.getDocument(params);
      res.send(new Article(response));
    } catch (err) {
      Controller.errorHandler(res, err);
    }
  }

  // Получение всех статьей
  static async getArticleList(req, res) {
    const params = Controller.createOptions({
      database: "articles",
      filter: req.query.tag ? { tags: req.query.tag } : {},
    });

    try {
      const response = await Controller.service.getCollection(params);
      res.send(response.map((item) => new Article(item)));
    } catch (err) {
      Controller.errorHandler(res, err);
    }
  }

  // Получение статьей которые лайкнул пользователь
  static async getFavoriteArticleList(req, res) {
    const paramsLikes = Controller.createOptions({
      database: "likes",
      collection: "articles",
      filter: { userId: res.locals.user._id },
    });

    try {
      const { likes = [] } = (await Controller.service.getDocument(paramsLikes)) || {};

      const paramsArticles = Controller.createOptions({
        database: "articles",
        filter: { id: { $in: likes } },
      });

      const response = await Controller.service.getCollection(paramsArticles);
      res.send(response.map((item) => new Article(item)));
    } catch (err) {
      Controller.errorHandler(res, err);
    }
  }

  // Получить популярные рекомендации по статьям
  static async getPopularArticleList(req, res) {
    const params = Controller.createOptions({
      database: "articles",
      size: 3,
    });

    try {
      const response = await Controller.service.getRandomCollection(params);

      let array = response.filter((item) => item.id !== req.query.id);
      if (array.length > 3) array.pop();

      res.send(array.map((item) => new Article(item)));
    } catch (err) {
      Controller.errorHandler(res, err);
    }
  }
}