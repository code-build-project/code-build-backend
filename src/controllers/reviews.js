import Review from "../models/Review.js";
import Controller from "../controllers/abstractController.js";

export default class Reviews extends Controller {
    // Получение всех отзывов
    static getList = async (req, res) => {
        const params = {
            database: "reviews",
            collection: "reviews",
        };

        try {
            const response = await Controller.service.getCollection(params);
            res.send(response.map((item) => new Review(item)));
        } catch (err) {
            Controller.errorHandler(res, err);
        }
    };
}