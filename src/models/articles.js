import mongoClient from "../mongoDb/mongoClient.js";

class Parameters {
  constructor(filter = {}, operator = {}) {
    this.filter = filter;
    this.operator = operator;
  }
}


// Получение всех статьей
export const getArticles = (filter) => {
  const parameters = new Parameters(filter);

  return mongoClient.getCollection('articles', 'articles', parameters);
}

// Добавить данного юзера в список лайков статьи
export const addLikeArticle = (filter, operator) => {
  const parameters = new Parameters(filter, operator);

  return mongoClient.updateDocument("articles", "articles", parameters);
};

// Удалить данного юзера из списка лайков статьи
export const deleteLikeArticle = (filter, operator) => {
  const parameters = new Parameters(filter, operator);

  return mongoClient.updateDocument("articles", "articles", parameters);
};