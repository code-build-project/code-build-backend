import mongoClient from "../mongoDb/mongoClient.js";

// Получение всех фильтров для статьей
export const getArticleFilters = () => {
  return mongoClient.getCollection('filters', 'articles');
}

// Получение всех фильтров для курсов
export const getCourseFilters = () => {
  return mongoClient.getCollection('filters', 'courses');
}