import { Router } from "express";
import { getArticles, getArticleFilters } from "../models/articles.js";

const router = Router();

router.get("/articles", (req, res) => {
  const collection = getArticles();

  collection.find({}).toArray((err, data) => {
    if (err) return console.log(err);
    res.send(data);
  });
});

router.get("/articles/filters", (req, res) => {
  const collection = getArticleFilters();

  collection.find({}).toArray((err, data) => {
    if (err) return console.log(err);
    res.send(data);
  });
});

export default router;