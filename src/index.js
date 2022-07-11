import cors from "cors";
import express from "express";
import keys from "./config/keys.js";
import mongoClient from "./mongoDb/mongoClient.js";
import authMiddleware from "./middleware/auth.js";

const app = express();

const PORT = keys.PORT || 4000;

// Подключения настроенной конфигурации CORS
app.use(cors());

// Подключение функций для получения данных в формате json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware
app.use(authMiddleware);

// Импорт и подключение роутов
import reg from "./routes/reg.js";
import auth from "./routes/auth.js";
import users from "./routes/users.js";
import likes from "./routes/likes.js";
import reviews from "./routes/reviews.js";
import courses from "./routes/courses.js";
import lessons from "./routes/lessons.js";
import articles from "./routes/articles.js";

app.use(reg);
app.use(auth);
app.use(users);
app.use(likes);
app.use(reviews);
app.use(courses);
app.use(lessons);
app.use(articles);

// Запуск сервера
mongoClient
    .connect()
    .then(() => {
        app.listen(PORT, "127.0.1.1");
        console.log("Сервер запустился...");
    })
    .catch((err) => {
        console.log("Произошла непредвиденная ошибка: " + err);
    });