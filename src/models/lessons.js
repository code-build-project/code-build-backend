import mongoClient from "../mongoDb/mongoClient.js";

// Получение всех видеоуроков
export const getLessons = () => {
  return mongoClient.getCollection('lessons', 'lessons');
}