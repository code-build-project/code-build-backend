import { Router } from "express";
import database from "../mongoDb/database.js";

const router = Router();

router.get("/courses", (req, res) => {
  const collection = database.users;

  collection.find({}).toArray((err, data) => {
    if (err) return console.log(err);
    res.send(data);
  });
});

router.post('/login', (req, res) => {
  const collection = database.users;

  collection.find({ email: req.body.email }).toArray((err, data) => {
    if (err) return console.log(err);
    res.send(data);
  });
});

export default router;
