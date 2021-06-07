import { Router } from "express";
import database from "../mongoDb/database.js";

const router = Router();

router.get("/articles", (req, res) => {
  const collection = database.articles;

  collection.find({}).toArray((err, data) => {
    if (err) return console.log(err);
    res.send(data);
  });
});

export default router;