import { Router } from "express";
import { getLessons } from "../models/lessons.js";

const router = Router();

router.get("/lessons", (req, res) => {
  const collection = getLessons();

  collection.find({}).toArray((err, data) => {
    if (err) return console.log(err);
    res.send(data);
  });
});

export default router;
