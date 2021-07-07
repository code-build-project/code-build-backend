import { Router } from "express";
import mongodb from "mongodb";
import { getArticles } from "../models/articles.js";

const router = Router();
const { ObjectId } = mongodb;

// Получение списка статьей, с фильрацией по тегу
router.get("/articles", (req, res) => {
  const collection = getArticles();

  collection.find({ tags: req.query.tag }).toArray((err, data) => {
    if (err) return console.log(err);
    res.send(data);
  });
});

// Получение статей которые лайкнул пользователь
router.get("/articles/favorites", (req, res) => {
  const collection = getArticles();

  collection.find({ likes: req.query.userId }).toArray((err, data) => {
    if (err) return console.log(err);
    res.send(data);
  });
});

// Добавление в список лайков, нового юзера
router.post("/articles/add-like", (req, res) => {
  const collection = getArticles();

  collection.findOneAndUpdate({_id: ObjectId(req.body.articleId)}, {$push: {likes: req.body.userId} }, (err, response) => {
    if (err) {
      return console.log(err);
    }
    console.log(response)
    // res(response);
  })
});

export default router;