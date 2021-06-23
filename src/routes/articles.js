import { Router } from "express";
import { getArticles } from "../models/articles.js";

const router = Router();

router.get("/articles", (req, res) => {
  const collection = getArticles();

  collection.find({ tags: req.query.tag }).toArray((err, data) => {
    if (err) return console.log(err);
    res.send(data);
  });
});

router.post("/articles/favorites", (req, res) => {
  const collection = getArticles();

  collection.find({}).toArray((err, data) => {
    if (err) return console.log(err);
    res.send(data);
  });
});

export default router;