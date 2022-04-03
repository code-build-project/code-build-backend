import mongoClient from "../mongoDb/mongoClient.js";
import MongoOptionsFactory from "../models/MongoOptions.js";

const factory = new MongoOptionsFactory();

// Получение списка лайков для определенного пользователя
const getLikeList = async (req, res) => {
  const params = factory.createOptions({
    database: "likes",
    collection: req.query.field,
    filter: { userId: req.headers.userId },
  });

  try {
    const response = await mongoClient.getDocument(params);
    const likeList = response ? response.likes : [];
    res.send(likeList);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Добавить id карточки в список лайков
const addLike = async (req, res) => {
  const params = factory.createOptions({
    database: "likes",
    collection: req.body.field,
    filter: { userId: req.headers.userId },
    operator: { $addToSet: { likes: req.body.id } },
  });

  try {
    const response = await mongoClient.updateDocument(params);
    res.send(response.value);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Удалить id карточки из списка лайков
const deleteLike = async (req, res) => {
  const params = factory.createOptions({
    database: "likes",
    collection: req.body.field,
    filter: { userId: req.headers.userId },
    operator: { $pull: { likes: req.body.id } },
  });

  try {
    const response = await mongoClient.updateDocument(params);
    res.send(response.value);
  } catch (err) {
    res.status(500).json(err);
  }
};

export default { getLikeList, addLike, deleteLike };