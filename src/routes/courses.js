import { Router } from "express";
import { getCourses } from "../models/courses.js";

const router = Router();

router.get("/courses", (req, res) => {
  getCourses("tags", req.query.tag)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(401).json({
        message: `Ошибка: ${err}`,
      });
    });
});

export default router;
