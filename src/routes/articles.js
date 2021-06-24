import { Router } from "express";
import { getArticles } from "../models/articles.js";

const router = Router();

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

export default router;