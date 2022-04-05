import { Review } from "../models/Reviews.js";
import mongoClient from "../mongoDb/mongoClient.js";
import MongoOptionsFactory from "../models/MongoOptions.js";

const factory = new MongoOptionsFactory();

export default class Reviews {
  // Получение всех отзывов
  static getList = async (req, res) => {
    const params = factory.createOptions({
      database: "reviews",
      collection: "reviews",
    });

    try {
      const response = await mongoClient.getCollection(params);
      res.send(response.map((item) => new Review(item)));
    } catch (err) {
      res.status(500).json(err);
    }
  }
}