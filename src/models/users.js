import mongoClient from "../mongoDb/mongoClient.js";

// Получение всех пользователей
export const getUsers = (keyName, keyValue) => {
  const parameters = {
    key: {[keyName]: keyValue}
  }

  return mongoClient.getDocument('users', 'users', parameters);
}

// Добавить нового пользователя
export const addUser = async (user) => {
  try {
    return await mongoClient.setCollection("users", "users", user);
  } catch (e) {
    throw e;
  }
};
