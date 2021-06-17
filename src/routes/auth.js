import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { Router } from "express";
import keys from "../config/keys.js";
import { getUsers } from "../models/users.js";

const router = Router();

router.post('/login', async (req, res) => {
  const collection = getUsers();

  const candidate = await collection.findOne({ email: req.body.email });

  // Пользователь существует, проверка пароля
  if (candidate) {
    const password = bcrypt.compareSync(req.body.password, candidate.password);
    
    // Пароли совпали, генерация токена
    if(password) {
      const token = jwt.sign({
        email: candidate.email,
        userId: candidate._id
      }, keys.jwt, {expiresIn: 3600});

      res.status(200).json({
        token: `Bearer ${token}`,
      });
    }
    // Пароли не совпали, ошибка
    else {
      res.status(401).json({
        message: "Неправильный логин или пароль!",
      });
    }
  } 
  // Пользователя нет, ошибка
  else {
    res.status(404).json({
      message: "Неправильный логин или пароль!",
    });
  }
});

export default router;
