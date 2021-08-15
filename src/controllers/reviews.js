import { Review } from "../models/Reviews.js";
import mongoClient from "../mongoDb/mongoClient.js";
import MongoOptionsFactory from "../models/MongoOptions.js";

const factory = new MongoOptionsFactory();

// Получение всех отзывов
export const getReviews = (req, res) => {
  const params = factory.createOptions({
    database: "reviews",
    collection: "reviews",
  });

  mongoClient
    .getCollection(params)
    .then((data) => {
      const reviews = data.map((item) => new Review(item));
      res.send(reviews);
    })
    .catch((err) => {
      res.status(401).json({
        message: `Ошибка: ${err}`,
      });
    });
};
