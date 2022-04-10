// Паттерн "Фабрика"

class Articles {
  constructor(options) {
    this.database = "articles";
    this.collection = "articles";
    this.filter = options.filter;
    this.operator = options.operator;
    this.size = options.size;
  }
}

class Courses {
  constructor(options) {
    this.database = "courses";
    this.collection = "courses";
    this.filter = options.filter;
    this.operator = options.operator;
    this.size = options.size;
  }
}

class Filters {
  constructor(options) {
    this.database = "filters";
    this.collection = options.collection;
  }
}

class Lessons {
  constructor(options) {
    this.database = "lessons";
    this.collection = options.collection;
    this.filter = options.filter;
    this.operator = options.operator;
  }
}

class Users {
  constructor(options) {
    this.database = "users";
    this.collection = options.collection || "users";
    this.newDocument = options.newDocument;
    this.filter = options.filter;
    this.operator = options.operator;
    this.lifeTime = options.lifeTime;
  }
}

class Reviews {
  constructor() {
    this.database = "reviews";
    this.collection = "reviews";
  }
}

class Likes {
  constructor(options) {
    this.database = "likes";
    this.collection = options.collection;
    this.filter = options.filter;
    this.operator = options.operator;
    this.option = {
      upsert: true,
      returnDocument: 'after',
    };
  }
}

export default class MongoOptionsFactory {
  createOptions(options) {
    switch (options.database) {
      case "articles":
        return new Articles(options);
      case "courses":
        return new Courses(options);
      case "filters":
        return new Filters(options);
      case "lessons":
        return new Lessons(options);
      case "users":
        return new Users(options);
      case "reviews":
        return new Reviews(options);
      case "likes":
        return new Likes(options);
    }
  }
}
