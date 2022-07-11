import mongoClient from "../mongoDb/mongoClient.js";

export default class AbstractController {
    static service = mongoClient;

    static errorHandler(res, err) {
        if (err.name === "Bad Request") {
            res.status(err.status).json(err);
        } else {
            res.status(500).json({
                type: err.name,
                message: err.message,
            });
        }
    }
}