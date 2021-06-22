import bcrypt from "bcryptjs"
import { Router } from "express";
import nodemailer from "nodemailer";
import { getUsers, addUser } from "../models/users.js";

const router = Router();

const transporter = nodemailer.createTransport({
  host: 'smtp.yandex.ru',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'code-build@yandex.ru',
    pass: 'azwlcwvqvxncjfae',
  },
})

let mail = {
  from: '"Codebuild" <code-build@yandex.ru>',
  to: 'ya.sham@yandex.ru',
  subject: 'Подтверждение регистрации',
  html:`
    <h2>Поздравляем! Вы успешно зарегестрировались на нашем сайте.</h2>

    <i>Данные вашей учетной записи:</i>
    <ul>
      <li>login: login</li>
      <li>password: password</li>
    </ul>
  `
}

router.post("/sign", async (req, res) => {
  const collection = getUsers();

  const candidate = await collection.findOne({ email: req.body.email });

  try {
    let result = await transporter.sendMail(mail);
    res.status(201).json(result)
  }
  catch(err) {
    res.status(404).json(err)
  }
  

  // if (candidate) {
  //   // Пользователь существует, нужно отправить ошибку
  //   res.status(409).json({
  //     message: "Такой email уже зарегестрирован!",
  //   });
  // } else {
  //   // "соль" для хеширования пароля
  //   const salt = bcrypt.genSaltSync(10); 

  //   // Новый пользователь с хешированым паролем
  //   const newUser = {
  //     email: req.body.email,
  //     password: bcrypt.hashSync(req.body.password, salt),
  //     name: req.body.name,
  //     isPremium: false
  //   };

  //   try {
  //     await addUser(newUser);
  //     res.status(201).json(newUser)
  //   } catch(e) {
  //     // какая то ошибка
  //     // res.status(404).json(e)
  //   }
  // }
});

export default router;
