import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import keys from "../config/keys.js";
import mongoClient from "../mongoDb/mongoClient.js";
import { generatePassword } from "../helpers/generate.js";
import MongoOptionsFactory from "../models/MongoOptions.js";
import { sendMail } from "../nodemailer/transporterMail.js";

const factory = new MongoOptionsFactory();

// Отправка кода подтверждения на почту и занесения нового пользователя в кандидаты
const create = async (req, res) => {
  try {
    // Проверка существования пользователя
    const paramsUser = factory.createOptions({
      database: "users",
      filter: { email: req.body.email },
    });

    const user = await mongoClient.getDocument(paramsUser);

    if (user) {
      const err = {
        name: "IncorrectEmail",
        message: "Пользователь с таким e-mail уже зарегистрирован.",
      };
      return res.status(401).json(err);
    }

    // Проверка отправки пароля на данный email ранее
    const paramsCandidate = factory.createOptions({
      database: "users",
      collection: "candidates",
      filter: { email: req.body.email },
    });

    const candidate = await mongoClient.getDocument(paramsCandidate);

    if (candidate) {
      const err = {
        name: "IncorrectEmail",
        message: "Срок действия предыдущего пароля еще не истек.",
      };
      return res.status(409).json(err);
    }

    // Генерация пароля и отправка на почту пользователя
    const password = generatePassword();

    const newCandidate = {
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
      createdAt: new Date(),
    };

    const info = {
      to: req.body.email,
      password: password,
      subject: "Подтверждение регистрации",
      message: "Во вложении пароль, для подтверждения регистрации.",
    };

    await sendMail(info);

    const paramsNewCandidate = factory.createOptions({
      database: "users",
      collection: "candidates",
      newValue: newCandidate,
    });

    await mongoClient.createIndex();
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

    const candidate = await mongoClient.getDocument(paramsCandidate);

    if (!candidate) {
      const err = {
        name: "IncorrectPassword",
        message: "Время подтверждения регистрации истекло.",
      };
      return res.status(401).json(err);
    }

    // Проверка на пустое значение пароля
    if (!req.body.password) {
      const err = {
        name: "IncorrectPassword",
        message: "Значение пароля не должно быть пустым.",
      };
      return res.status(400).json(err);
    }

    // Проверка на совпадение пароля от клинета и пароля в БД кандадатов
    const password = bcrypt.compareSync(req.body.password, candidate.password);

    if (!password) {
      const err = {
        name: "IncorrectPassword",
        message: "Неправильный пароль.",
      };
      return res.status(401).json(err);
    }

    // Проверка на существования пользователя в БД
    const paramsUser = factory.createOptions({
      database: "users",
      filter: { email: candidate.email },
    });

    const user = await mongoClient.getDocument(paramsUser);

    if (user) {
      const err = {
        name: "IncorrectEmail",
        message: "Такой e-mail уже зарегестрирован.",
      };
      return res.status(409).json(err);
    }

    // Добавление нового пользователя в БД и возвращение токена клиенту
    const newUser = {
      name: candidate.name,
      email: candidate.email,
      password: candidate.password,
      isPremium: false,
    };

    const params = factory.createOptions({
      database: "users",
      newValue: newUser,
    });

    await mongoClient.updateCollection(params);

    const token = jwt.sign(newUser, keys.jwt, { expiresIn: 21600 });
    res.status(201).json({ token: `Bearer ${token}` });
  } catch (err) {
    res.status(500).json(err);
  }
};

export default { create, confirm };
