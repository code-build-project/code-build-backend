import { Router } from "express";
import { getCourses } from "../models/courses.js";

const router = Router();

router.get("/courses", (req, res) => {
  const collection = getCourses();

  collection.find({ tags: req.query.tag }).toArray((err, data) => {
    if (err) return console.log(err);
    res.send(data);
  });
});

export default router;
