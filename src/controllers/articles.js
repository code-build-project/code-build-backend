import { Article } from "../models/Articles.js";
import mongoClient from "../mongoDb/mongoClient.js";
import MongoOptionsFactory from "../models/MongoOptions.js";

const factory = new MongoOptionsFactory();

// Получение всех статьей
export const getArticles = async (req, res) => {
  const params = factory.createOptions({
    database: "articles",
    filter: req.query.tag ? { tags: req.query.tag } : {},
  });

  try {
    const response = await mongoClient.getCollection(params);
    res.send(response.map((item) => new Article(item)));
  } catch (err) {
    res.status(401).json({
      message: `Ошибка: ${err}`,
    });
  }
};

// Получить одну статью по id
export const getArticle = async (req, res) => {
  const params = factory.createOptions({
    database: "articles",
    filter: { id: req.query.id },
  });

  try {
    const response = await mongoClient.getDocument(params);
    res.send(new Article(response));
  } catch (err) {
    res.status(401).json({
      message: `Ошибка: ${err}`,
    });
  }
};

// Получение статьей которые лайкнул пользователь
export const getFavoriteArticles = async (req, res) => {
  const params = factory.createOptions({
    database: "articles",
    filter: { likes: req.query.userId },
  });

  try {
    const response = await mongoClient.getCollection(params);
    res.send(response.map((item) => new Article(item)));
  } catch (err) {
    res.status(401).json({
      message: `Ошибка: ${err}`,
    });
  }
};

// Добавить данного юзера в список лайков статьи
export const addLikeArticle = async (req, res) => {
  const params = factory.createOptions({
    database: "articles",
    filter: { id: req.body.articleId },
    operator: { $push: { likes: req.body.userId } },
  });

  try {
    const response = await mongoClient.updateDocument(params);
    res.send(response.value);
  } catch (err) {
    res.status(401).json({
      message: `Ошибка: ${err}`,
    });
  }
};

// Удалить данного юзера из списка лайков статьи
export const deleteLikeArticle = async (req, res) => {
  const params = factory.createOptions({
    database: "articles",
    filter: { id: req.body.articleId },
    operator: { $pull: { likes: req.body.userId } },
  });

  try {
    const response = await mongoClient.updateDocument(params);
    res.send(response.value);
  } catch (err) {
    res.status(401).json({
      message: `Ошибка: ${err}`,
    });
  }
};
