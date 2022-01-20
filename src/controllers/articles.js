import { Article } from "../models/Articles.js";
import mongoClient from "../mongoDb/mongoClient.js";
import MongoOptionsFactory from "../models/MongoOptions.js";

const factory = new MongoOptionsFactory();

// Получение всех статьей
export const getArticleList = async (req, res) => {
  const params = factory.createOptions({
    database: "articles",
    filter: req.query.tag ? { tags: req.query.tag } : {},
  });

  try {
    const response = await mongoClient.getCollection(params);
    res.send(response.map((item) => new Article(item)));
  } catch (err) {
    res.status(500).json(err);
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
    res.status(500).json(err);
  }
};

// Получение статьей которые лайкнул пользователь
export const getFavoriteArticleList = async (req, res) => {
  const params = factory.createOptions({
    database: "articles",
    filter: { likes: req.headers.userId },
  });

  try {
    const response = await mongoClient.getCollection(params);
    res.send(response.map((item) => new Article(item)));
  } catch (err) {
    res.status(500).json(err);
  }
};

// Добавить данного юзера в список лайков статьи
export const addLikeArticle = async (req, res) => {
  const params = factory.createOptions({
    database: "articles",
    filter: { id: req.body.articleId },
    operator: { $push: { likes: req.headers.userId } },
  });

  try {
    const response = await mongoClient.updateDocument(params);
    res.send(response.value);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Удалить данного юзера из списка лайков статьи
export const deleteLikeArticle = async (req, res) => {
  const params = factory.createOptions({
    database: "articles",
    filter: { id: req.body.articleId },
    operator: { $pull: { likes: req.headers.userId } },
  });

  try {
    const response = await mongoClient.updateDocument(params);
    res.send(response.value);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Получить популярные рекомендации по статьям
export const getPopularArticleList = async (req, res) => {
  const params = factory.createOptions({
    database: "articles",
    size: 3,
  });

  try {
    const response = await mongoClient.getRandomCollection(params);

    let array = response.filter((item) => item.id !== req.query.id);
    if (array.length > 3) array.pop();

    res.send(array.map((item) => new Article(item)));
  } catch (err) {
    res.status(500).json(err);
  }
};
