import mongoClient from "../mongoDb/mongoClient.js";

// Получение всех статьей
export const getArticles = () => {
  return mongoClient.getCollection('articles', 'articles');
}

// Обновить данные статьи
export const addUserLike = async (id, newValue) => {
  try {
    return await mongoClient.setCollection("articles", "articles", id, newValue);
  } catch (e) {
    throw e;
  }
};
