/*
  Данный файл служит некой локальной БД, где собирается в один общий объект все данные из mongoDb.
  Все файлы проекта могут получить данные из БД, импортировав этот файл.
*/
let database = {};

export function updateDatabase(data) {
  database.courses = data.db("courses").collection("courses"); // Коллекция курсов

  database.courseFilters = data.db("courses").collection("filters"); // Коллекция фильтров курсов

  database.lessons = data.db("lessons").collection("lessons"); // Коллекция уроков

  database.articles = data.db("articles").collection("articles"); // Коллекция статьей
  
  database.articleFilters = data.db("articles").collection("filters"); // Коллекция фильтров статьей
}

export default database;