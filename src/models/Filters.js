export class Parameters {
  constructor(database, collection, filter, operator) {
    this.database = database;
    this.collection = collection;
    this.filter = filter;
    this.operator = operator;
  }
}

export class Filter {
  constructor(filter) {
    this._id = filter._id;
    this.name = filter.name;
    this.tag = filter.tag; 
  }
}