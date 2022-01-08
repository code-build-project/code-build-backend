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
  async connect() {
    const response = await mongoClient.connect();
    database = response;
    return response;
  },

  // Получение имен всех коллекций указанной базы данных
  async getCollectionNames(params) {
    const db = database.db(params.database);
    const collection = db.listCollections({});
    const response = await collection.toArray();
    return response.map((item) => item.name);
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
    const db = database.db(params.database);
    const collection = db.collection(params.collection);
    return collection.find(params.filter).toArray();
  },

  // Получение рандомной коллекции
  getRandomCollection(params) {
    const db = database.db(params.database);
    const collection = db.collection(params.collection);
    return collection.aggregate([{$sample: {size: params.size}}]).toArray();
  },

  // Получение одного документа из коллекции
  getDocument(params) {
    const db = database.db(params.database);
    const collection = db.collection(params.collection);
    return collection.findOne(params.filter);
  },

  // Добавление нового элемента в коллекцию
  updateCollection(params) {
    const db = database.db(params.database);
    const collection = db.collection(params.collection);
    return collection.insertOne(params.newValue);
  },

  // Обновить документ коллекции
  updateDocument(params) {
    const db = database.db(params.database);
    const collection = db.collection(params.collection);
    return collection.findOneAndUpdate(params.filter, params.operator);
  },

  // Добавить индекс времени жизни для документов
  createIndex() {
    const db = database.db('users');
    const collection = db.collection('candidates');
    collection.createIndex( { "createdAt": 1 }, { expireAfterSeconds: 60 } );
  }
};
