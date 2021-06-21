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
  from: '"Node js" <code-build@yandex.ru>',
  to: 'ya.sham@yandex.ru',
  subject: 'Message from Node js',
  text: 'This message was sent from Node js server.',
  html:
    'This <i>message</i> was sent from <strong>Node js</strong> server.',
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
