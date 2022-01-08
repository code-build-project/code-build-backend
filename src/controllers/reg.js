import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import keys from "../config/keys.js";
import mongoClient from "../mongoDb/mongoClient.js";
import MongoOptionsFactory from "../models/MongoOptions.js";
import { sendMail } from "../nodemailer/transporterMail.js";

const factory = new MongoOptionsFactory();

function generatePassword() {
  const symbols =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const min = 8;
  const max = 12;
  const length = Math.floor(Math.random() * (max - min + 1)) + min;
  let password = "";

  for (let i = 0; i < length; i++) {
    password += symbols.charAt(Math.floor(Math.random() * symbols.length));
  }

  return password;
}

// Отправка кода подтверждения на почту и занесения нового пользователя в кандидаты
export const registration = async (req, res) => {
  const paramsUser = factory.createOptions({
    database: "users",
    filter: { email: req.body.email },
  });

  const user = await mongoClient.getDocument(paramsUser);

  if (user) {
    res.status(401).json({
      message: "Пользователь с таким e-mail уже зарегистрирован.",
    });
  } else {
    const paramsCandidate = factory.createOptions({
      database: "users",
      collection: "candidates",
      filter: { email: req.body.email },
    });

    const candidate = await mongoClient.getDocument(paramsCandidate);

    if (candidate) {
      res.status(409).send("Врямя для повторной отправки кода еще не истекло.");
    } else {
      const password = generatePassword();

      const newCandidate = {
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
        createdAt: new Date(),
      };

      try {
        const result = await sendMail(password);

        const paramsNewCandidate = factory.createOptions({
          database: "users",
          collection: "candidates",
          newValue: newCandidate,
        });

        await mongoClient.updateCollection(paramsNewCandidate);

        res.status(201).json(result);
      } catch (err) {
        res.status(404).json(err);
      }
    }
  }
};

// Подтверждение регистрации и добаваление нового пользователя в БД
export const completionRegistration = async (req, res) => {
  const paramsCandidate = factory.createOptions({
    database: "users",
    collection: "candidates",
    filter: { email: req.body.email },
  });

  const candidate = await mongoClient.getDocument(paramsCandidate);
  const password = bcrypt.compareSync(req.body.password, candidate.password);

  if (!password) {
    res.status(401).send("Неправильный пароль.");
  } else {
    const paramsUser = factory.createOptions({
      database: "users",
      filter: { email: candidate.email },
    });

    const user = await mongoClient.getDocument(paramsUser);

    if (user) {
      res.status(409).send("Такой email уже зарегестрирован!");
    } else {
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

      try {
        await mongoClient.updateCollection(params);
        const token = jwt.sign(
          newUser,
          keys.jwt,
          { expiresIn: 3600 }
        );

        res.status(200).json({
          token: `Bearer ${token}`,
        });
      } catch (e) {
        res.status(404).json(e);
      }
    }
  }
};
