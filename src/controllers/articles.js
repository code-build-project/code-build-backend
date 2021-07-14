import mongodb from "mongodb";
import mongoClient from "../mongoDb/mongoClient.js";
import { Parameters, Article } from "../models/Articles.js";

const { ObjectId } = mongodb;

// Получение всех статьей
export const getArticles = (req, res) => {
  const parameters = new Parameters({ tags: req.query.tag });

  mongoClient.getCollection('articles', 'articles', parameters)
    .then(data => {
      const articles = data.map((item) => new Article(item));
      res.send(articles);
    })
    .catch((err) => {
      res.status(401).json({
        message: `Ошибка: ${err}`,
      });
    });
}

// Получение статьей которые лайкнул пользователь
export const getFavoriteArticles = (req, res) => {
  const parameters = new Parameters({ likes: req.query.userId });

  mongoClient.getCollection('articles', 'articles', parameters)
    .then(data => {
      const articles = data.map((item) => new Article(item));
      res.send(articles);
    })
    .catch(err => {
      res.status(401).json({
        message: `Ошибка: ${err}`,
      });
    });
}

// Добавить данного юзера в список лайков статьи
export const addLikeArticle = (req, res) => {
  const parameters = new Parameters(
    { _id: ObjectId(req.body.articleId) }, 
    { $push: {likes: req.body.userId} },
  );

  mongoClient.updateDocument("articles", "articles", parameters)
    .then((response) => res.send(response.value))
    .catch((err) => {
      res.status(401).json({
        message: `Ошибка: ${err}`,
      });
    });
};

// Удалить данного юзера из списка лайков статьи
export const deleteLikeArticle = (req, res) => {
  const parameters = new Parameters(
    { _id: ObjectId(req.body.articleId) }, 
    { $pull: {likes: req.body.userId} },
  );

  mongoClient.updateDocument("articles", "articles", parameters)
    .then((response) => res.send(response.value))
    .catch((err) => {
      res.status(401).json({
        message: `Ошибка: ${err}`,
      });
    });
};