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
const mongoClient = new MongoClient(keys.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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

  // Получение имена всех коллекций указанной базы данных
  getCollectionNames(databaseName, parameters = {}) {
    return new Promise((resolve, reject) => {
      database
        .db(databaseName)
        .listCollections(parameters)
        .toArray((err, response) => {
          if (err) {
            reject(err);
          }

          resolve(response.map((item) => item.name));
        });
    });
  },

  // Получение содержимого всех коллекций указанной базы данных
  async getDatabase(databaseName, parameters) {
    let collectionNames = await this.getCollectionNames(databaseName);
    let allCollections = [];

    for (var i = 0; i < collectionNames.length; i++) {
      await this.getCollection(databaseName, collectionNames[i], parameters)
        .then((response) => {
          allCollections.push(...response);
        })
        .catch((err) => {
          throw err;
        });
    }

    return allCollections;
  },

  // Получение коллекции
  getCollection(databaseName, collectionName, parameters) {
    return new Promise((resolve, reject) => {
      database
        .db(databaseName)
        .collection(collectionName)
        .find(parameters.filter)
        .toArray((err, response) => {
          if (err) {
            reject(err);
          }

          resolve(response);
        });
    });
  },

  // Получение одного документа из коллекции
  getDocument(databaseName, collectionName, parameters) {
    return database
      .db(databaseName)
      .collection(collectionName)
      .findOne(parameters.key);
  },

  // Добавление нового элемента в коллекцию
  updateCollection(databaseName, collectionName, document) {
    return new Promise((resolve, reject) => {
      database
        .db(databaseName)
        .collection(collectionName)
        .insertOne(document, (err, response) => {
          if (err) {
            reject(err);
          }

          resolve(response);
        });
    });
  },

  // Обновить документ коллекции
  updateDocument(databaseName, collectionName, parameters) {
    return new Promise((resolve, reject) => {
      database
        .db(databaseName)
        .collection(collectionName)
        .findOneAndUpdate(
          parameters.key,
          parameters.operator,
          (err, response) => {
            if (err) {
              reject(err);
            }

            resolve(response);
          }
        );
    });
  },
};
