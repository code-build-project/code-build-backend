import mongoClient from "../mongoDb/mongoClient.js";

// Получение всех курсов
export const getCourses = () => {
  return mongoClient.getCollection('courses', 'courses');
}