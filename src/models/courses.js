import mongoClient from "../mongoDb/mongoClient.js";

// Получение всех курсов
export const getCourses = (keyName, keyValue) => {
  const parameters = {
    key: {[keyName]: keyValue}
  }

  return mongoClient.getCollection('courses', 'courses', parameters);
}