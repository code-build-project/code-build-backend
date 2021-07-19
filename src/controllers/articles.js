import mongodb from "mongodb";
import { Article } from "../models/Articles.js";
import mongoClient from "../mongoDb/mongoClient.js";
import MongoOptionsFactory from "../models/MongoOptions.js";

const { ObjectId } = mongodb;
const factory = new MongoOptionsFactory();

// Получение всех статьей
export const getArticles = (req, res) => {
  const params = factory.createOptions({
    database: "articles",
    filter: { tags: req.query.tag },
  });

  mongoClient
    .getCollection(params)
    .then((data) => {
      const articles = data.map((item) => new Article(item));
      res.send(articles);
    })
    .catch((err) => {
      res.status(401).json({
        message: `Ошибка: ${err}`,
      });
    });
};

// Получение статьей которые лайкнул пользователь
export const getFavoriteArticles = (req, res) => {
  const params = factory.createOptions({
    database: "articles",
    filter: { likes: req.query.userId },
  });

  mongoClient
    .getCollection(params)
    .then((data) => {
      const articles = data.map((item) => new Article(item));
      res.send(articles);
    })
    .catch((err) => {
      res.status(401).json({
        message: `Ошибка: ${err}`,
      });
    });
};

// Добавить данного юзера в список лайков статьи
export const addLikeArticle = (req, res) => {
  const params = factory.createOptions({
    database: "articles",
    filter: { _id: ObjectId(req.body.articleId) },
    operator: { $push: { likes: req.body.userId } },
  });

  mongoClient
    .updateDocument(params)
    .then((response) => res.send(response.value))
    .catch((err) => {
      res.status(401).json({
        message: `Ошибка: ${err}`,
      });
    });
};

// Удалить данного юзера из списка лайков статьи
export const deleteLikeArticle = (req, res) => {
  const params = factory.createOptions({
    database: "articles",
    filter: { _id: ObjectId(req.body.articleId) },
    operator: { $pull: { likes: req.body.userId } },
  });

  mongoClient
    .updateDocument(params)
    .then((response) => res.send(response.value))
    .catch((err) => {
      res.status(401).json({
        message: `Ошибка: ${err}`,
      });
    });
};
