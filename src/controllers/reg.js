import bcrypt from "bcryptjs";
import validator from "../validators/reg.js";
import { createToken } from "../helpers/token.js";
import { sendMail } from "../helpers/nodemailer.js";
import { generatePassword } from "../helpers/generate.js";
import Controller from "../controllers/abstractController.js";

export default class Registration extends Controller {
    // Отправка пароля подтверждения на почту и занесения нового пользователя в кандидаты
    static async create(req, res) {
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

            validator.isName(req.body.name);
            validator.formatName(req.body.name);
            validator.maxLengthName(req.body.name.length, 20);
            validator.isEmail(req.body.email);
            validator.formatEmail(req.body.email);
            validator.maxLengthEmail(req.body.email.length);
            validator.isUser(user);
            validator.isCandidate(candidate);

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
                lifeTime: 100,
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
    static async confirm(req, res) {
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

            validator.isEmail(req.body.email);
            validator.formatEmail(req.body.email);
            validator.isUser(user);
            validator.timeRegCandidate(candidate);
            validator.isPassword(req.body.password);
            validator.correctPassword(req.body.password, candidate.password);

            const params = {
                database: "users",
                collection: "users",
                newDocument: {
                    name: candidate.name,
                    email: candidate.email,
                    password: candidate.password,
                    isPremium: false,
                },
            };

            const newUser = await Controller.service.updateCollection(params);

            const token = createToken({
                id: newUser.insertedId,
                name: candidate.name,
                email: candidate.email,
                isPremium: false,
                password: candidate.password,
            });
            res.status(201).json({ token: `Bearer ${token}` });
        } catch (err) {
            Controller.errorHandler(res, err);
        }
    }
}