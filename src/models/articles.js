import mongoClient from "../mongoDb/mongoClient.js";

// Получение всех статьей
export const getArticles = () => {
  return mongoClient.getCollection('articles', 'articles');
}

// Получение всех фильтров для статьей
export const getArticleFilters = () => {
  return mongoClient.getCollection('articles', 'filters');
}