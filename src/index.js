import cors from "cors";
import express from "express";
import keys from "./config/keys.js";
import mongoClient from "./mongoDb/mongoClient.js";

const app = express();

const PORT = keys.PORT || 4000;

// Подключения настроенной конфигурации CORS
app.use(cors());

// Подключение функций для получения данных в формате json
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

// Импорт и подключение роутов
import reg from "./routes/reg.js";
import auth from "./routes/auth.js";
import user from "./routes/user.js";
import courses from "./routes/courses.js";
import lessons from "./routes/lessons.js";
import articles from "./routes/articles.js";

app.use(reg);
app.use(auth);
app.use(user);
app.use(courses);
app.use(lessons);
app.use(articles);


// Запуск сервера
mongoClient.connect()
  .then(() => {
    app.listen(PORT, "127.0.1.1");
    console.log("Сервер запустился...");
  })
  .catch((err) => {
    console.log("Произошла непредвиденная ошибка: " + err);
  });
