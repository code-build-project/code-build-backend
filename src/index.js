import cors from "cors";
import express from "express";
import { connect } from "./mongoDb/mongoClient.js";

const PORT = process.env.PORT || 4000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }))

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
connect()
  .then(() => {
    app.listen(PORT, "127.0.1.1");
    console.log("Сервер запустился...");
  })
  .catch((err) => {
    console.log("Произошла непредвиденная ошибка: " + err);
  });
