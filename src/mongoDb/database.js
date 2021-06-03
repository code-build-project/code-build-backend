/*
  Данный файл служит некой локальной БД, где собирается в один общий объект все данные из mongoDb.
  Все файлы могут получить данные из БД, импортировав этот файл.
*/
let database = {};

export function updateDatabase(data) {
  database.courses = data.db("courses").collection("courses"); // Коллекция курсов

  database.lessons = data.db("lessons").collection("lessons"); // Коллекция уроков
}

export default database;