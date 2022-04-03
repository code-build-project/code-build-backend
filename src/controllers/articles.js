import { Article } from "../models/Articles.js";
import mongoClient from "../mongoDb/mongoClient.js";
import MongoOptionsFactory from "../models/MongoOptions.js";

const factory = new MongoOptionsFactory();

// Получить одну статью по id
const getArticle = async (req, res) => {
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

// Получение всех статьей
const getArticleList = async (req, res) => {
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

// Получение статьей которые лайкнул пользователь
const getFavoriteArticleList = async (req, res) => {
  const paramsLikes = factory.createOptions({
    database: "likes",
    collection: "articles",
    filter: { userId: req.headers.userId },
  });

  try {
    const { likes = [] } = await mongoClient.getDocument(paramsLikes) || {};

    const paramsArticles = factory.createOptions({
      database: "articles",
      filter: { id: { $in: likes } },
    });

    const response = await mongoClient.getCollection(paramsArticles);
    res.send(response.map((item) => new Article(item)));
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
};

// Получить популярные рекомендации по статьям
const getPopularArticleList = async (req, res) => {
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

export default { getArticle, getArticleList, getFavoriteArticleList, getPopularArticleList };