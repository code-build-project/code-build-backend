export class Parameters {
  constructor(database, collection, filter, operator) {
    this.database = database;
    this.collection = collection;
    this.filter = filter;
    this.operator = operator;
  }
}

export class Article {
  constructor(article) {
    this._id = article._id;
    this.title = article.title;
    this.date = article.date; 
    this.time = article.time;
    this.views = article.views;
    this.tags = article.tags;
    this.likes = article.likes;
  }
}