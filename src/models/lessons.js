import mongoClient from "../mongoDb/mongoClient.js";

// Получение всех видеоуроков
export const getLessons = () => {
  const parameters = {}

  return mongoClient.getCollection('lessons', 'lessons', parameters);
}