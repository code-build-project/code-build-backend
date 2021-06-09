import { Router } from "express";
import database from "../mongoDb/database.js";

const router = Router();

router.get("/courses", (req, res) => {
  const collection = database.courses;

  collection.find({}).toArray((err, data) => {
    if (err) return console.log(err);
    res.send(data);
  });
});

router.get("/courses/filters", (req, res) => {
  const collection = database.courseFilters;

  collection.find({}).toArray((err, data) => {
    if (err) return console.log(err);
    res.send(data);
  });
});

export default router;
