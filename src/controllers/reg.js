import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import keys from "../config/keys.js";
import validate from "../validates/reg.js";
import mongoClient from "../mongoDb/mongoClient.js";
import { generatePassword } from "../helpers/generate.js";
import MongoOptionsFactory from "../models/MongoOptions.js";
import { sendMail } from "../nodemailer/transporterMail.js";

const factory = new MongoOptionsFactory();

// Отправка пароля подтверждения на почту и занесения нового пользователя в кандидаты
const create = async (req, res) => {
  try {
    const paramsUser = factory.createOptions({
      database: "users",
      filter: { email: req.body.email },
    });

    const paramsCandidate = factory.createOptions({
      database: "users",
      collection: "candidates",
      filter: { email: req.body.email },
    });

    const user = await mongoClient.getDocument(paramsUser);
    const candidate = await mongoClient.getDocument(paramsCandidate);

    // Проверки
    const err = validate.create(user, candidate, req);
    if (err) return res.status(err.status).json(err.data);

    // Генерация пароля и отправка на почту пользователя
    const password = generatePassword();

    const info = {
      to: req.body.email,
      password: password,
      subject: "Подтверждение регистрации",
      message: "Во вложении пароль, для подтверждения регистрации.",
    };

    await sendMail(info);

    const paramsIndexCandidate = factory.createOptions({
      database: "users",
      collection: "candidates",
      lifeTime: 40,
    });
    
    const newCandidate = {
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
      createdAt: new Date(),
    };

    const paramsNewCandidate = factory.createOptions({
      database: "users",
      collection: "candidates",
      newDocument: newCandidate,
    });

    await mongoClient.createIndex(paramsIndexCandidate);
    await mongoClient.updateCollection(paramsNewCandidate);

    const message = "Пароль для активации аккаунта отправлен на почту.";
    res.status(200).json({ message });
  } catch (err) {
    res.status(500).json(err);
  }
};

// Подтверждение регистрации и добаваление нового пользователя в БД
const confirm = async (req, res) => {
  try {
    // Проверка существования кандидата в БД
    const paramsCandidate = factory.createOptions({
      database: "users",
      collection: "candidates",
      filter: { email: req.body.email },
    });

    const paramsUser = factory.createOptions({
      database: "users",
      filter: { email: req.body.email },
    });

    const candidate = await mongoClient.getDocument(paramsCandidate);
    const user = await mongoClient.getDocument(paramsUser);

    // Проверки
    const err = validate.confirm(user, candidate, req);
    if (err) return res.status(err.status).json(err.data);

    // Добавление нового пользователя в БД и возвращение токена клиенту
    const newUser = {
      name: candidate.name,
      email: candidate.email,
      password: candidate.password,
      isPremium: false,
    };

    const params = factory.createOptions({
      database: "users",
      newDocument: newUser,
    });

    await mongoClient.updateCollection(params);

    const token = jwt.sign(newUser, keys.jwt, { expiresIn: 21600 });
    res.status(201).json({ token: `Bearer ${token}` });
  } catch (err) {
    res.status(500).json(err);
  }
};

export default { create, confirm };
