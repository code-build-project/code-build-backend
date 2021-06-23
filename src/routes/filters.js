import { Router } from "express";
import { getArticleFilters, getCourseFilters } from "../models/filters.js";

const router = Router();

router.get("/filters/articles", (req, res) => {
  const collection = getArticleFilters();

  collection.find({}).toArray((err, data) => {
    if (err) return console.log(err);
    res.send(data);
  });
});

router.get("/filters/courses", (req, res) => {
  const collection = getCourseFilters();

  collection.find({}).toArray((err, data) => {
    if (err) return console.log(err);
    res.send(data);
  });
});

export default router;