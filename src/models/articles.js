import mongoClient from "../mongoDb/mongoClient.js";

// Получение всех статьей
export const getArticles = () => {
  return mongoClient.getCollection('articles', 'articles');
}