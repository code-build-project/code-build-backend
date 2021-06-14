import cors from "cors";
import express from "express";
import mongoClient from "./mongoDb/mongoClient.js";

const PORT = process.env.PORT || 4000;

const app = express();

// Подключение функций для получения данных в формате json
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

// Подключения настроенной конфигурации CORS
app.use(cors());

// Импорт и подключение роутов
import courses from "./routes/courses.js";
import lessons from "./routes/lessons.js";
import articles from "./routes/articles.js";
import auth from "./routes/auth.js";

app.use(courses);
app.use(lessons);
app.use(articles);
app.use(auth);


// Запуск сервера
mongoClient.connect()
  .then(() => {
    app.listen(PORT, "127.0.1.1");
    console.log("Сервер запустился...");
  })
  .catch((err) => {
    console.log("Произошла непредвиденная ошибка: " + err);
  });
