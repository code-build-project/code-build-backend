import mongoClient from "../mongoDb/mongoClient.js";

// Получение всех пользователей
export const getUsers = () => {
  return mongoClient.getCollection('users', 'users');
}

// Добавить нового пользователя
export const addUser = async (user) => {
  try {
    return await mongoClient.setCollection('users', 'users', user);
  } catch(e) {
    throw e;
  }
}