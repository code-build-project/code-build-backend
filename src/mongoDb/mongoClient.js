import mongodb from "mongodb";
import keys from "../config/keys.js";

const { MongoClient } = mongodb;
let database = {};

/* 
  Вначале создается объект MongoClient. Для этого в его конструктор передается два параметра. 
  Первый параметр - это адрес сервера. 
  Второй парамтр - это необязательный объкт конфигурации. 
  Свойство useUnifiedTopology: true - оно указывает, что надо использовать единую топологию драйвера для node.js.
*/
const mongoClient = new MongoClient(
  keys.mongoURI,
  { useNewUrlParser: true, useUnifiedTopology: true }
);

export default {
  // Подключение к БД
  connect() {
    return new Promise((resolve, reject) => {
      mongoClient.connect((err, response) => {
        if (err) reject(err);

        database = response; 
        resolve(response);
      });
    });
  },

  // Получение коллекции
  getCollection(databaseName, collectionName) {
    return database.db(databaseName).collection(collectionName);
  },

  // Добавление нового элемента в коллекцию
  setCollection(databaseName, collectionName, user) {
    return new Promise((resolve, reject) => {
      database
        .db(databaseName)
        .collection(collectionName)
        .insertOne(user, (err, response) => {
          if (err) {
            reject(err);
          }

          resolve(response);
        });
    });
  },

  // Обновить документ коллекции
  updateCollectionDocument(databaseName, collectionName, id, newValue) {
    return new Promise((resolve, reject) => {
      database
        .db(databaseName)
        .collection(collectionName)
        .findOneAndUpdate({_id: id}, {$push: newValue}, (err, response) => {
          if (err) {
            reject(err);
          }

          resolve(response);
        });
    });
  },
};
