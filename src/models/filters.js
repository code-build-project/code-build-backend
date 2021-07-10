import mongoClient from "../mongoDb/mongoClient.js";

// Получение всех фильтров для статьей
export const getArticleFilters = () => {
  const parameters = {}

  return mongoClient.getCollection('filters', 'articles', parameters);
}

// Получение всех фильтров для курсов
export const getCourseFilters = () => {
  const parameters = {}

  return mongoClient.getCollection('filters', 'courses', parameters);
}