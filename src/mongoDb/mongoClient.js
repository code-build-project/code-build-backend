import mongodb from "mongodb";
import keys from "../config/keys.js";

const { MongoClient } = mongodb;
let mongoDB = {};

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
  /**
   * Подключение к БД
   */
  async connect() {
    const response = await mongoClient.connect();
    mongoDB = response;
    return response;
  },

  /**
   * Проверка существования коллекции в указанной БД
   * @param {string} database - название БД
   */
  async checkCollectionName(params) {
    const db = mongoDB.db(params.database);
    const collection = db.listCollections({});
    const response = await collection.toArray();
    return response.length ? true : false;
  },

  /**
   * Получение имен всех коллекций в указанной БД
   * @param {string} database - название БД
   */
  async getCollectionNameList(params) {
    const db = mongoDB.db(params.database);
    const collection = db.listCollections({});
    const response = await collection.toArray();
    return response.map((item) => item.name);
  },

  /**
   * Получение содержимого всех коллекций в указанной БД
   * @param {string} collection - название коллекции
   */
  async getDatabase(params) {
    let collectionNames = await this.getCollectionNameList(params);
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

  /**
   * Получение коллекции
   * @param {string} database - название БД
   * @param {string} collection - название коллекции
   * @param {string} filter - параметры для фильтрации
   */
  getCollection(params) {
    const db = mongoDB.db(params.database);
    const collection = db.collection(params.collection);
    return collection.find(params.filter).toArray();
  },

  /**
   * Получение рандомных документов из коллекции
   * @param {string} database - название БД
   * @param {string} collection - название коллекции
   * @param {string} size - количество документов
   */
  getRandomDocumentList(params) {
    const db = mongoDB.db(params.database);
    const collection = db.collection(params.collection);
    return collection.aggregate([{ $sample: { size: params.size } }]).toArray();
  },

  /**
   * Получение документа из коллекции
   * @param {string} database - название БД
   * @param {string} collection - название коллекции
   * @param {string} filter - параметры для фильтрации
   */
  getDocument(params) {
    const db = mongoDB.db(params.database);
    const collection = db.collection(params.collection);
    return collection.findOne(params.filter);
  },

  /**
   * Добавление нового документа в коллекцию
   * @param {string} database - название БД
   * @param {string} collection - название коллекции
   * @param {string} newDocument - данные для нового документа
   */
  updateCollection(params) {
    const db = mongoDB.db(params.database);
    const collection = db.collection(params.collection);
    return collection.insertOne(params.newDocument);
  },

  /**
   * Обновить документ коллекции
   * @param {string} database - название БД
   * @param {string} collection - название коллекции
   * @param {string} filter - параметры для фильтрации
   * @param {string} operator - параметр обновления
   * @param {string} option - дополнительные настройки (например: upsert: true)
   */
  updateDocument(params) {
    const { filter, operator, option } = params;

    const db = mongoDB.db(params.database);
    const collection = db.collection(params.collection);
    return collection.findOneAndUpdate(filter, operator, option);
  },

  /**
   * Добавить в коллекцию индекс времени жизни для документов
   * @param {string} database - название БД
   * @param {string} collection - название коллекции
   * @param {string} lifeTime - время жизни документа
   */
  createIndex(params) {
    const db = mongoDB.db(params.database);
    const collection = db.collection(params.collection);
    return collection.createIndex({ createdAt: 1 }, { expireAfterSeconds: params.lifeTime });
  },
};
