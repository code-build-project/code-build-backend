import express from "express";
import { connect } from "./mongoDb/mongoClient.js";

// Импорт роутов
import courses from "./routes/courses.js";



const PORT = process.env.PORT || 4000;

const app = express();

// Подключение роутов
app.use(courses);

connect()
  .then(() => {
    app.listen(PORT, "127.0.1.1");
    console.log("Сервер запустился...");
  })
  .catch((err) => {
    console.log("Произошла непредвиденная ошибка: " + err);
  });
