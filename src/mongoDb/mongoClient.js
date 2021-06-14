import mongodb from "mongodb";

const { MongoClient } = mongodb;
let database = {};

/* 
  Вначале создается объект MongoClient. Для этого в его конструктор передается два параметра. 
  Первый параметр - это адрес сервера. 
  Второй парамтр - это необязательный объкт конфигурации. 
  Свойство useUnifiedTopology: true - оно указывает, что надо использовать единую топологию драйвера для node.js.
*/
const mongoClient = new MongoClient(
  "mongodb+srv://code-build:code-build@cluster0.3bdan.mongodb.net/todos",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

export default {
  connect() {
    return new Promise((resolve, reject) => {
      mongoClient.connect((err, response) => {
        if (err) {
          console.log("Не удалось подключиться к базе данных!");
          reject(err);
        }

        database = response; // При удачном соединении, записываем полученные данные БД

        resolve(response);
      });
    });
  },

  getCollection(databaseName, collectionName) {
    return database.db(databaseName).collection(collectionName);
  }
}
