import validator from "../validators/likes.js";
import Controller from "../controllers/AbstractController.js";

export default class Likes extends Controller {
  // Получение списка лайков для определенного пользователя
  static async getLikeList(req, res) {
    const params = {
      database: "likes",
      collection: req.query.field,
      filter: { userId: res.locals.user.id },
    };

    try {
      const response = await Controller.service.getDocument(params);
      const likeList = response ? response.likes : [];
      res.send(likeList);
    } catch (err) {
      Controller.errorHandler(res, err);
    }
  }

  // Добавить id карточки в список лайков
  static async addLike(req, res) {
    const paramsField = {
      database: req.body.field
    }

    const paramsDocument = {
      database: req.body.field,
      collection: req.body.field,
      filter: { id: req.body.id },
    };

    const paramsLike = {
      database: "likes",
      collection: req.body.field,
      filter: { userId: res.locals.user.id },
      operator: { $addToSet: { likes: req.body.id } },
      option: { upsert: true },
    };

    try {
      const isField = await Controller.service.checkCollectionName(paramsField);
      validator.isField(isField, req.body.field);

      const document = await Controller.service.getDocument(paramsDocument);
      validator.isDocument(document, req.body.id, req.body.field);

      await Controller.service.updateDocument(paramsLike);
      res.send('Успешно!');
    } catch (err) {
      Controller.errorHandler(res, err);
    }
  }

  // Удалить id карточки из списка лайков
  static async deleteLike(req, res) {
    const paramsField = {
      database: req.body.field
    }

    const params = {
      database: "likes",
      collection: req.body.field,
      filter: { userId: res.locals.user.id },
      operator: { $pull: { likes: req.body.id } },
      option: { upsert: true },
    };

    try {
      const isField = await Controller.service.checkCollectionName(paramsField);

      validator.isField(isField, req.body.field);

      await Controller.service.updateDocument(params);
      res.send('Успешно!');
    } catch (err) {
      Controller.errorHandler(res, err);
    }
  }
}