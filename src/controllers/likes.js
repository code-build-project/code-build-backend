import validator from "../validators/likes.js";
import Controller from "../controllers/abstractController.js";

export default class Likes extends Controller {
  // Получение списка лайков для определенного пользователя
  static async getLikeList(req, res) {
    const params = {
      database: "likes",
      collection: req.query.field,
      filter: { userId: res.locals.user.id },
    };

    try {
      validator.isField(req.query.field);

      const response = await Controller.service.getDocument(params);
      const likeList = response ? response.likes : [];
      res.send(likeList);
    } catch (err) {
      Controller.errorHandler(res, err);
    }
  }

  // Добавить id карточки в список лайков
  static async addLike(req, res) {
    const { field, id, courseId } = req.body;

    const paramsField = {
      database: field,
    },
    paramsDocument = {
      database: field,
      collection: field === 'lessons' ? courseId : field,
      filter: { id: id },
    },
    paramsLike = {
      database: "likes",
      collection: field,
      filter: { userId: res.locals.user.id },
      operator: { $addToSet: { likes: id } },
      option: { upsert: true },
    };

    try {
      validator.isId(id);
      validator.isField(field);
      validator.isCourseId(field, courseId);

      let isField = await Controller.service.checkCollectionName(paramsField);
      validator.hasField(isField, field);

      let document = await Controller.service.getDocument(paramsDocument);
      validator.hasDocument(document, id, field);

      await Controller.service.updateDocument(paramsLike);
      res.send('Успешно!');
    } catch (err) {
      Controller.errorHandler(res, err);
    }
  }

  // Удалить id карточки из списка лайков
  static async deleteLike(req, res) {
    const { field, id } = req.body;

    const paramsField = {
      database: field
    },
    paramsLike = {
      database: "likes",
      collection: field,
      filter: { userId: res.locals.user.id },
      operator: { $pull: { likes: id } },
      option: { upsert: true },
    };

    try {
      validator.isId(id);
      validator.isField(field);

      let isField = await Controller.service.checkCollectionName(paramsField);
      validator.hasField(isField, field);

      await Controller.service.updateDocument(paramsLike);
      res.send('Успешно!');
    } catch (err) {
      Controller.errorHandler(res, err);
    }
  }
}