import mongoClient from "../mongoDb/mongoClient.js";

export default class AbstractController {
  static service = mongoClient;

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