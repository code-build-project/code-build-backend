import bcrypt from "bcryptjs"
import { Router } from "express";
import { getUsers, addUser } from "../models/users.js";

const router = Router();

router.post("/sign", async (req, res) => {
  const collection = getUsers();

  const candidate = await collection.findOne({ email: req.body.email });

  if (candidate) {
    // Пользователь существует, нужно отправить ошибку
    res.status(409).json({
      message: "Такой email уже зарегестрирован!",
    });
  } else {
    // "соль" для хеширования пароля
    const salt = bcrypt.genSaltSync(10); 

    // Новый пользователь с хешированым паролем
    const newUser = {
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, salt),
      name: req.body.name,
      isPremium: false
    };

    try {
      await addUser(newUser);
      res.status(201).json(newUser)
    } catch(e) {
      // какая то ошибка
      // res.status(404).json(e)
    }
  }
});

export default router;
