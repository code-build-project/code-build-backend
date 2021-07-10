import { Router } from "express";
import { getLessons } from "../models/lessons.js";

const router = Router();

router.get("/lessons", (req, res) => {
  getLessons()
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
