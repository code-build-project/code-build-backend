import { Review } from "../models/Reviews.js";
import mongoClient from "../mongoDb/mongoClient.js";
import MongoOptionsFactory from "../models/MongoOptions.js";

const factory = new MongoOptionsFactory();

// Получение всех отзывов
export const getReviews = async (req, res) => {
  const params = factory.createOptions({
    database: "reviews",
    collection: "reviews",
  });

  try {
    const response = await mongoClient.getCollection(params);
    res.send(response.map((item) => new Review(item)));
  } catch (err) {
    res.status(401).json({
      message: `Ошибка: ${err}`,
    });
  }
};
