import mongodb from "mongodb";
import mongoClient from "../mongoDb/mongoClient.js";

const { ObjectId } = mongodb;

// Получение всех видеоуроков из всех коллекций
export const getAllLessons = (keyName, keyValue) => {
  const parameters = {
    key: {[keyName]: keyValue}
  }

  return mongoClient.getDatabase('lessons', parameters);
}

// Получение видеоуроков из указанной коллекции
export const getCourseLessons = (collectionName) => {
  const parameters = {}

  return mongoClient.getCollection('lessons', collectionName, parameters);
}

// Добавить данного юзера в список лайков видеоуроков
export const addLikeLesson = (lessonId, userId, collectionName) => {
  const parameters = {
    key: {_id: ObjectId(lessonId)},
    operator: {$push: {likes: userId}}
  }

  return mongoClient.updateDocument("lessons", collectionName, parameters);
};

// Удалить данного юзера из списка лайков видеоуроков
export const deleteLikeLesson = (lessonId, userId, collectionName) => {
  const parameters = {
    key: {_id: ObjectId(lessonId)},
    operator: {$pull: {likes: userId}}
  }

  return mongoClient.updateDocument("lessons", collectionName, parameters);
};