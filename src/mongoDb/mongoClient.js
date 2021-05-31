import { update } from "./database.js";
import mongodb from "mongodb";

const { MongoClient } = mongodb;

/* Создаем объект MongoClient и передаем ему строку подключения.

  Вначале создается объект MongoClient. Для этого в его конструктор передается два параметра. 
  Первый параметр - это адрес сервера. 
  Второй парамтр - это необязательный объкт конфигурации. 
  Свойство useUnifiedTopology: true - оно указывает, что надо использовать единую топологию драйвера для node.js.*/
const mongoClient = new MongoClient(
  "mongodb+srv://code-build:code-build@cluster0.3bdan.mongodb.net/todos",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

export function connect() {
  return new Promise((resolve, reject) => {
    mongoClient.connect((err, response) => {
      if (err) {
        console.log("Не удалось подключиться к базе данных!");
        reject(err);
      }

      update(response.db("todos")); // При удачном соединении, обновляем общий объект БД

      resolve(response);
    });
  });
}
