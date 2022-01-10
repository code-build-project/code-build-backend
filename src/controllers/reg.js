import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import keys from "../config/keys.js";
import mongoClient from "../mongoDb/mongoClient.js";
import MongoOptionsFactory from "../models/MongoOptions.js";
import { sendMail } from "../nodemailer/transporterMail.js";
import { generatePassword } from "../helpers/generate.js";

const factory = new MongoOptionsFactory();

// Отправка кода подтверждения на почту и занесения нового пользователя в кандидаты
export const registration = async (req, res) => {
  try {
    // Проверка существования пользователя
    const paramsUser = factory.createOptions({
      database: "users",
      filter: { email: req.body.email },
    });

    const user = await mongoClient.getDocument(paramsUser);

    if (user) {
      const message = "Пользователь с таким e-mail уже зарегистрирован.";
      return res.status(401).json({ message });
    }

    // Проверка отправки пароля на данный email ранее
    const paramsCandidate = factory.createOptions({
      database: "users",
      collection: "candidates",
      filter: { email: req.body.email },
    });

    const candidate = await mongoClient.getDocument(paramsCandidate);

    if (candidate) {
      const message = "Срок действия предыдущего пароля еще не истек.";
      return res.status(409).json({ message });
    }

    // Генерация пароля и отправка на почту пользователя
    const password = generatePassword();

    const newCandidate = {
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
      createdAt: new Date(),
    };

    await sendMail(password);

    const paramsNewCandidate = factory.createOptions({
      database: "users",
      collection: "candidates",
      newValue: newCandidate,
    });

    await mongoClient.updateCollection(paramsNewCandidate);

    const message = "Пароль для активации отправлен на почту.";
    res.status(200).json({ message });
  } catch (err) {
    res.status(500).json(err);
  }
};

// Подтверждение регистрации и добаваление нового пользователя в БД
export const completionRegistration = async (req, res) => {
  try {
    // Проверка существования кандидата в БД
    const paramsCandidate = factory.createOptions({
      database: "users",
      collection: "candidates",
      filter: { email: req.body.email },
    });

    const candidate = await mongoClient.getDocument(paramsCandidate);

    if (!candidate) {
      const message = "Время подтверждения регистрации истекло.";
      return res.status(401).json({ message });
    }

    // Проверка на пустое значение пароля
    if (!req.body.password) {
      const message = "Значение пароля не должно быть пустым.";
      return res.status(400).json({ message });
    }

    // Проверка на совпадение пароля от клинета и пароля в БД кандадатов
    const password = bcrypt.compareSync(req.body.password, candidate.password);

    if (!password) {
      const message = "Неправильный пароль.";
      return res.status(401).json({ message });
    }

    const paramsUser = factory.createOptions({
      database: "users",
      filter: { email: candidate.email },
    });

    // Проверка на существования пользователя в БД
    const user = await mongoClient.getDocument(paramsUser);

    if (user) {
      const message = "Такой e-mail уже зарегестрирован.";
      return res.status(409).json({ message });
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

    const token = jwt.sign(newUser, keys.jwt, { expiresIn: 3600 });
    res.status(201).json({ token: `Bearer ${token}` });
  } catch (err) {
    res.status(500).json(err);
  }
};

// Восстановление пароля
export const recovery = async (req, res) => {
  try {
    const paramsUser = factory.createOptions({
      database: "users",
      filter: { email: req.body.email },
    });

    const user = await mongoClient.getDocument(paramsUser);

    if (!user) {
      const message = "Пользователь с таким e-mail не зарегистрирован.";
      return res.status(401).json({ message });
    }

    // Запись нового пароля в БД и отправка на почту пользователя
    const newPassword = generatePassword();

    await sendMail(newPassword);

    const paramsPassword = factory.createOptions({
      database: "users",
      filter: { email: req.body.email },
      operator: {
        $set: {
          password: bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10)),
        },
      },
    });

    await mongoClient.updateDocument(paramsPassword);

    const message = "Пароль успешно изменен.";
    return res.status(201).json({ message });
  } catch (err) {
    res.status(500).json(err);
  }
};
