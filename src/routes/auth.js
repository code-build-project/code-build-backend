import { Router } from "express";
import { getUsers } from "../models/users.js";

const router = Router();

router.post('/login', (req, res) => {
  const collection = getUsers();

  collection.find({ email: req.body.email }).toArray((err, data) => {
    if (err) return console.log(err);
    res.send(data);
  });
});

export default router;
