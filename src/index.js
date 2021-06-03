import express from "express";
import { connect } from "./mongoDb/mongoClient.js";

const PORT = process.env.PORT || 4000;

const app = express();

// Импорт роутов
import courses from "./routes/courses.js";
import lessons from "./routes/lessons.js";

// Подключение роутов
app.use(courses);
app.use(lessons);

connect()
  .then(() => {
    app.listen(PORT, "127.0.1.1");
    console.log("Сервер запустился...");
  })
  .catch((err) => {
    console.log("Произошла непредвиденная ошибка: " + err);
  });
