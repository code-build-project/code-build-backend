import jwt from "jsonwebtoken"
import { Router } from "express";
import keys from "../config/keys.js";

const router = Router();

router.get('/user', (req, res) => {
  //Токен валидный, возвращаем данные пользователя
  try {
    const decoded = jwt.verify(req.headers.authorization, keys.jwt);

    res.status(200).json(decoded);
  } 
  // Неверный токен, ошибка
  catch(err) {
    res.status(401).json({
      message: `Ошибка: ${err}`,
    });
  }
});

export default router;
