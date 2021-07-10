import mongodb from "mongodb";
import mongoClient from "../mongoDb/mongoClient.js";

const { ObjectId } = mongodb;

// Получение всех статьей
export const getArticles = (keyName, keyValue) => {
  const parameters = {
    key: {[keyName]: keyValue}
  }

  return mongoClient.getCollection('articles', 'articles', parameters);
}

// Добавить данного юзера в список лайков статьи
export const addLikeArticle = (articleId, userId) => {
  const parameters = {
    key: {_id: ObjectId(articleId)},
    operator: {$push: {likes: userId}}
  }

  return mongoClient.updateDocument("articles", "articles", parameters);
};

// Удалить данного юзера из списка лайков статьи
export const deleteLikeArticle = (articleId, userId) => {
  const parameters = {
    key: {_id: ObjectId(articleId)},
    operator: {$pull: {likes: userId}}
  }

  return mongoClient.updateDocument("articles", "articles", parameters);
};