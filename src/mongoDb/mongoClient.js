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
  getCollectionNames(params) {
    return new Promise((resolve, reject) => {
      database
        .db(params.database)
        .listCollections({})
        .toArray((err, response) => {
          if (err) {
            reject(err);
          }

          resolve(response.map((item) => item.name));
        });
    });
  },

  // Получение содержимого всех коллекций указанной базы данных
  async getDatabase(params) {
    let collectionNames = await this.getCollectionNames(params);
    let allCollections = [];

    for (let i = 0; i < collectionNames.length; i++) {
      params.collection = collectionNames[i];

      await this.getCollection(params)
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
  getCollection(params) {
    return new Promise((resolve, reject) => {
      database
        .db(params.database)
        .collection(params.collection)
        .find(params.filter)
        .toArray((err, response) => {
          if (err) {
            reject(err);
          }

          resolve(response);
        });
    });
  },

  // Получение одного документа из коллекции
  getDocument(params) {
    return database
      .db(params.database)
      .collection(params.collection)
      .findOne(params.filter);
  },

  // Добавление нового элемента в коллекцию
  updateCollection(params) {
    return new Promise((resolve, reject) => {
      database
        .db(params.database)
        .collection(params.collection)
        .insertOne(params.newValue, (err, response) => {
          if (err) {
            reject(err);
          }

          resolve(response);
        });
    });
  },

  // Обновить документ коллекции
  updateDocument(params) {
    return new Promise((resolve, reject) => {
      database
        .db(params.database)
        .collection(params.collection)
        .findOneAndUpdate(params.filter, params.operator, (err, response) => {
          if (err) {
            reject(err);
          }

          resolve(response);
        });
    });
  },
};
