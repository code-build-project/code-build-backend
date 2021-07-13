import mongoClient from "../mongoDb/mongoClient.js";

class Parameters {
  constructor(filter = {}, operator = {}) {
    this.filter = filter;
    this.operator = operator;
  }
}

// Получение всех пользователей
export const getUsers = (keyName, keyValue) => {
  const parameters = {
    key: {[keyName]: keyValue}
  }

  return mongoClient.getDocument('users', 'users', parameters);
}

// Добавить нового пользователя
export const addUser = (user) => {

  return mongoClient.updateCollection("users", "users", user);
};
