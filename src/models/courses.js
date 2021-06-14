import mongoClient from "../mongoDb/mongoClient.js";

// Получение всех курсов
export const getCourses = () => {
  return mongoClient.getCollection('courses', 'courses');
}

// Получение всех фильтров для курсов
export const getCourseFilters = () => {
  return mongoClient.getCollection('courses', 'filters');
}