import bcrypt from "bcryptjs";
import mongodb from "mongodb";
import User from "../models/User.js";
import validator from "../validators/users.js";
import { createToken } from "../helpers/token.js";
import Controller from "../controllers/abstractController.js";

const { ObjectId } = mongodb;

export default class Users extends Controller {
    // Получение данных пользователя по токену(если токен верный)
    static get(req, res) {
        try {
            res.status(200).json(new User(res.locals.user));
        } catch (err) {
            Controller.errorHandler(res, err);
        }
    }

    // Изменение данных пользователя
    static async change(req, res) {
        let newVersion = ++res.locals.user.version;

        let paramsUserChanges = {
            database: "users",
            collection: "users",
            filter: { _id: ObjectId(res.locals.user.id) },
            operator: {
                $set: {
                    name: req.body.name,
                    version: newVersion,
                },
            },
        };

        let newPassword = res.locals.user.password;

        try {
            validator.isName(req.body.name);
            validator.formatName(req.body.name);
            validator.maxLengthName(req.body.name.length, 20);

            if (req.body.isChangePassword) {
                validator.isOldPassword(req.body.oldPassword);
                validator.correctPassword(
                    req.body.oldPassword,
                    res.locals.user.password,
                    "oldPassword"
                );
                validator.minLengthPassword(req.body.newPassword.length);
                validator.maxLengthPassword(req.body.newPassword.length);
                validator.hasGapsPassword(req.body.newPassword);
                validator.hasInvalidCharacters(req.body.newPassword);
                validator.matchPasswords(req.body.oldPassword, req.body.newPassword);
                
                newPassword = bcrypt.hashSync(req.body.newPassword, bcrypt.genSaltSync(10));
                paramsUserChanges.operator.$set.password = newPassword;
            }

            await Controller.service.updateDocument(paramsUserChanges);

            const token = createToken({
                id: res.locals.user.id,
                email: res.locals.user.email,
                version: newVersion,
            });

            res.status(200).json({ token: `Bearer ${token}` });
        } catch (err) {
            Controller.errorHandler(res, err);
        }
    }
}