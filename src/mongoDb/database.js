// Общий объект, для хранения данных из БД
let database = {};

export function update(data) {
  database.todos = data.collection("todos"); // Коллекция планирований
}
export default database;
