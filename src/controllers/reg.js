import bcrypt from "bcryptjs";
import validate from "../validates/reg.js";
import { createToken } from "../helpers/token.js";
import mongoClient from "../mongoDb/mongoClient.js";
import { generatePassword } from "../helpers/generate.js";
import MongoOptionsFactory from "../models/MongoOptions.js";
import { sendMail } from "../nodemailer/transporterMail.js";

const factory = new MongoOptionsFactory();

export default class Registration {
  // Отправка пароля подтверждения на почту и занесения нового пользователя в кандидаты
  static async create (req, res) {
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

      const err = validate.create(req, user, candidate);
      if (err) return res.status(err.status).json(err.data);

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
  }

  // Подтверждение регистрации и добаваление нового пользователя в БД
  static async confirm (req, res) {
    try {
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

      const err = validate.confirm(req, user, candidate);
      if (err) return res.status(err.status).json(err.data);

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

      const token = createToken(newUser);
      res.status(201).json({ token: `Bearer ${token}` });
    } catch (err) {
      res.status(500).json(err);
    }
  }
}