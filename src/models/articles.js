export class Parameters {
  constructor(filter = {}, operator = {}) {
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