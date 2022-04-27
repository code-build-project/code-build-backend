import Tag from "../models/Tag.js";
import Article from "../models/Article.js";
import validator from "../validators/articles.js";
import Controller from "../controllers/abstractController.js";

export default class Articles extends Controller {
  // Получить одну статью по id
  static async getArticle(req, res) {
    const params = {
      database: "articles",
      collection: "articles",
      filter: { id: req.query.id },
    };

    try {
      validator.isId(req.query.id);
      const response = await Controller.service.getDocument(params);

      validator.isArticle(response);
      res.send(new Article(response));
    } catch (err) {
      Controller.errorHandler(res, err);
    }
  }

  // Получение всех статьей
  static async getArticleList(req, res) {
    const params = {
      database: "articles",
      collection: "articles",
      filter: req.query.tag ? { tags: req.query.tag } : {},
    };

    try {
      const response = await Controller.service.getCollection(params);
      res.send(response.map((item) => new Article(item)));
    } catch (err) {
      Controller.errorHandler(res, err);
    }
  }

  // Получение статьей которые лайкнул пользователь
  static async getFavoriteArticleList(req, res) {
    const paramsLikes = {
      database: "likes",
      collection: "articles",
      filter: { userId: res.locals.user.id },
    };

    try {
      const { likes = [] } = (await Controller.service.getDocument(paramsLikes)) || {};

      const paramsArticles = {
        database: "articles",
        collection: "articles",
        filter: { id: { $in: likes } },
      };

      const response = await Controller.service.getCollection(paramsArticles);
      res.send(response.map((item) => new Article(item)));
    } catch (err) {
      Controller.errorHandler(res, err);
    }
  }

  // Получить рандомно, популярные статьи
  static async getPopularArticleList(req, res) {
    const params = {
      database: "articles",
      collection: "articles",
      size: 3,
    };

    try {
      const response = await Controller.service.getRandomDocumentList(params);

      let array = response.filter((item) => item.id !== req.query.id);
      if (array.length > 3) array.pop();

      res.send(array.map((item) => new Article(item)));
    } catch (err) {
      Controller.errorHandler(res, err);
    }
  }

  // Получение тэгов статей
  static async getTagList(req, res) {
    const params = {
      database: "articles",
      collection: "tags",
    };

    try {
      const response = await Controller.service.getCollection(params);
      res.send(response.map((item) => new Tag(item)));
    } catch (err) {
      Controller.errorHandler(res, err);
    }
  }
}