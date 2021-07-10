import mongodb from "mongodb";
import mongoClient from "../mongoDb/mongoClient.js";

const { ObjectId } = mongodb;

// Получение всех курсов
export const getCourses = (keyName, keyValue) => {
  const parameters = {
    key: {[keyName]: keyValue}
  }

  return mongoClient.getCollection('courses', 'courses', parameters);
}

// Добавить данного юзера в список лайков курса
export const addLikeCourse = (courseId, userId) => {
  const parameters = {
    key: {_id: ObjectId(courseId)},
    operator: {$push: {likes: userId}}
  }

  return mongoClient.updateDocument("courses", "courses", parameters);
};

// Удалить данного юзера из списка лайков курса
export const deleteLikeCourse = (courseId, userId) => {
  const parameters = {
    key: {_id: ObjectId(courseId)},
    operator: {$pull: {likes: userId}}
  }

  return mongoClient.updateDocument("courses", "courses", parameters);
};