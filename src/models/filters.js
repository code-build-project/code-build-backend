import mongoClient from "../mongoDb/mongoClient.js";

class Parameters {
  constructor(filter = {}, operator = {}) {
    this.filter = filter;
    this.operator = operator;
  }
}

// Получение всех фильтров для статьей
export const getArticleFilters = (req, res) => {
  const parameters = new Parameters();

  mongoClient.getCollection('filters', 'articles', parameters)
    .then(data => res.send(data))
    .catch((err) => {
      res.status(401).json({
        message: `Ошибка: ${err}`,
      });
    });
}

// Получение всех фильтров для курсов
export const getCourseFilters = (req, res) => {
  const parameters = new Parameters();

  mongoClient.getCollection('filters', 'courses', parameters)
    .then(data => res.send(data))
    .catch((err) => {
      res.status(401).json({
        message: `Ошибка: ${err}`,
      });
    });
}