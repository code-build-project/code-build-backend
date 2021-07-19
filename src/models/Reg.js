export class Parameters {
  constructor(database, collection, filter, operator) {
    this.database = database;
    this.collection = collection;
    this.filter = filter;
    this.operator = operator;
  }
}
