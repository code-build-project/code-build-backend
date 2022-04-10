import mongoClient from "../mongoDb/mongoClient.js";
import MongoOptionsFactory from "../models/MongoOptions.js";

const factory = new MongoOptionsFactory();

export default class AbstractController {
  static service = mongoClient;

  static createOptions(params) {
    return factory.createOptions(params);
  }

  static errorHandler(res, err) {
    if (err.name === 'MessageError') {
      res.status(err.status).json({
        type: err.type,
        message: err.message,
      })
    } else {
      res.status(500).json(err);
    }
  }
}