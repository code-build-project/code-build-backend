import mongoClient from "../mongoDb/mongoClient.js";
import MongoOptionsFactory from "../models/MongoOptions.js";

const factory = new MongoOptionsFactory();

export default class Likes {
  // Получение списка лайков для определенного пользователя
  static async getLikeList(req, res) {
    const params = factory.createOptions({
      database: "likes",
      collection: req.query.field,
      filter: { userId: res.locals.user._id },
    });

    try {
      const response = await mongoClient.getDocument(params);
      const likeList = response ? response.likes : [];
      res.send(likeList);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // Добавить id карточки в список лайков
  static async addLike(req, res) {
    const params = factory.createOptions({
      database: "likes",
      collection: req.body.field,
      filter: { userId: res.locals.user._id },
      operator: { $addToSet: { likes: req.body.id } },
    });

    try {
      const response = await mongoClient.updateDocument(params);
      res.send(response.value);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // Удалить id карточки из списка лайков
  static async deleteLike(req, res) {
    const params = factory.createOptions({
      database: "likes",
      collection: req.body.field,
      filter: { userId: res.locals.user._id },
      operator: { $pull: { likes: req.body.id } },
    });

    try {
      const response = await mongoClient.updateDocument(params);
      res.send(response.value);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}