import bcrypt from "bcryptjs";
import validate from "../validates/reg.js";
import { createToken } from "../helpers/token.js";
import { generatePassword } from "../helpers/generate.js";
import { sendMail } from "../config/nodemailer.js";
import Controller from "../controllers/AbstractController.js";

export default class Registration extends Controller {
  // Отправка пароля подтверждения на почту и занесения нового пользователя в кандидаты
  static async create (req, res) {
    try {
      const paramsUser = {
        database: "users",
        collection: "users",
        filter: { email: req.body.email },
      };

      const paramsCandidate = {
        database: "users",
        collection: "candidates",
        filter: { email: req.body.email },
      };

      const user = await Controller.service.getDocument(paramsUser);
      const candidate = await Controller.service.getDocument(paramsCandidate);

      validate.create(req, user, candidate);

      const password = generatePassword();

      const info = {
        to: req.body.email,
        password: password,
        subject: "Подтверждение регистрации",
        message: "Во вложении пароль, для подтверждения регистрации.",
      };

      await sendMail(info);

      const paramsIndexCandidate = {
        database: "users",
        collection: "candidates",
        lifeTime: 40,
      };

      const newCandidate = {
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
        createdAt: new Date(),
      };

      const paramsNewCandidate = {
        database: "users",
        collection: "candidates",
        newDocument: newCandidate,
      };

      await Controller.service.createIndex(paramsIndexCandidate);
      await Controller.service.updateCollection(paramsNewCandidate);

      const message = "Пароль для активации аккаунта отправлен на почту.";
      res.status(200).json({ message });
    } catch (err) {
      Controller.errorHandler(res, err);
    }
  }

  // Подтверждение регистрации и добаваление нового пользователя в БД
  static async confirm (req, res) {
    try {
      const paramsCandidate = {
        database: "users",
        collection: "candidates",
        filter: { email: req.body.email },
      };

      const paramsUser = {
        database: "users",
        collection: "users",
        filter: { email: req.body.email },
      };

      const candidate = await Controller.service.getDocument(paramsCandidate);
      const user = await Controller.service.getDocument(paramsUser);

      validate.confirm(req, user, candidate);

      const newUser = {
        name: candidate.name,
        email: candidate.email,
        password: candidate.password,
        isPremium: false,
      };

      const params = {
        database: "users",
        collection: "users",
        newDocument: newUser,
      };

      await Controller.service.updateCollection(params);

      const token = createToken(newUser);
      res.status(201).json({ token: `Bearer ${token}` });
    } catch (err) {
      Controller.errorHandler(res, err);
    }
  }
}