import { Filter } from "../models/Filters.js";
import mongoClient from "../mongoDb/mongoClient.js";
import MongoOptionsFactory from "../models/MongoOptions.js";

const factory = new MongoOptionsFactory();

// Получение всех фильтров для статьей
export const getArticleFilters = (req, res) => {
  const params = factory.createOptions({
    database: "filters",
    collection: "articles",
  });

  mongoClient
    .getCollection(params)
    .then((data) => {
      const filters = data.map((item) => new Filter(item));
      res.send(filters);
    })
    .catch((err) => {
      res.status(401).json({
        message: `Ошибка: ${err}`,
      });
    });
};

// Получение всех фильтров для курсов
export const getCourseFilters = (req, res) => {
  const params = factory.createOptions({
    database: "filters",
    collection: "courses",
  });

  mongoClient
    .getCollection(params)
    .then((data) => {
      const filters = data.map((item) => new Filter(item));
      res.send(filters);
    })
    .catch((err) => {
      res.status(401).json({
        message: `Ошибка: ${err}`,
      });
    });
};
