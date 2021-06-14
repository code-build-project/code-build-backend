import mongoClient from "../mongoDb/mongoClient.js";

// Получение всех пользователей
export const getUsers = () => {
  return mongoClient.getCollection('users', 'users');
}