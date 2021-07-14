import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import keys from "../config/keys.js";
import mongoClient from "../mongoDb/mongoClient.js";

class Parameters {
  constructor(filter = {}, operator = {}) {
    this.filter = filter;
    this.operator = operator;
  }
}

// Авторизация с возвратом сгенерированного токена
export const login = async (req, res) => {
  const parameters = new Parameters({ email: req.body.email });

  const candidate = await mongoClient.getDocument('users', 'users', parameters);

  // Пользователь существует, проверка пароля
  if (candidate) {
    const password = bcrypt.compareSync(req.body.password, candidate.password);
    
    // Пароли совпали, генерация токена
    if(password) {
      const token = jwt.sign({
        email: candidate.email,
        id: candidate._id,
        name: candidate.name,
        isPremium: candidate.isPremium
      }, keys.jwt, {expiresIn: 3600});

      res.status(200).json({
        token: `Bearer ${token}`,
      });
    }
    // Пароли не совпали, ошибка
    else {
      res.status(401).json({
        message: "Неправильный логин или пароль!",
      });
    }
  } 
  // Пользователя нет, ошибка
  else {
    res.status(404).json({
      message: "Неправильный логин или пароль!",
    });
  }
};