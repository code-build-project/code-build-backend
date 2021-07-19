import mongoClient from "../mongoDb/mongoClient.js";
import { Parameters, Filter } from "../models/Filters.js";

// Получение всех фильтров для статьей
export const getArticleFilters = (req, res) => {
  const params = new Parameters("filters", "articles", {}, {});

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
  const params = new Parameters("filters", "courses", {}, {});

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
