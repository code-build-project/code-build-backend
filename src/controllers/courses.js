import Tag from "../models/Tag.js";
import Course from "../models/Course.js";
import validator from "../validators/courses.js";
import Controller from "../controllers/abstractController.js";

export default class Courses extends Controller {
    // Получение одного курса по id
    static async getCourse(req, res) {
        const params = {
            database: "courses",
            collection: "courses",
            filter: { id: req.query.id },
        };

        try {
            validator.isId(req.query.id);

            const response = await Controller.service.getDocument(params);

            validator.isCourse(response);
            res.send(new Course(response));
        } catch (err) {
            Controller.errorHandler(res, err);
        }
    }

    // Получение всех курсов
    static async getCourseList(req, res) {
        const params = {
            database: "courses",
            collection: "courses",
            filter: req.query.tag ? { tags: req.query.tag } : {},
        };

        try {
            const response = await Controller.service.getCollection(params);
            res.send(response.map((item) => new Course(item)));
        } catch (err) {
            Controller.errorHandler(res, err);
        }
    }

    // Получение курсов которые лайкнул пользователь
    static async getFavoriteCourseList(req, res) {
        let params = {
            database: "likes",
            collection: "courses",
            filter: { userId: res.locals.user.id },
        };

        try {
            const { likes = [] } = (await Controller.service.getDocument(params)) || {};

            params = {
                database: "courses",
                collection: "courses",
                filter: { id: { $in: likes } },
            };
            const response = await Controller.service.getCollection(params);
            
            res.send(response.map((item) => new Course(item)));
        } catch (err) {
            Controller.errorHandler(res, err);
        }
    }

    // Получить рандомно, популярные курсы
    static async getPopularCourseList(req, res) {
        const params = {
            database: "courses",
            collection: "courses",
            size: 3,
        };

        try {
            const response = await Controller.service.getRandomDocumentList(params);

            let array = response.filter((item) => item.id !== req.query.id);
            if (array.length > 3) array.pop();

            res.send(array.map((item) => new Course(item)));
        } catch (err) {
            Controller.errorHandler(res, err);
        }
    }

    // Получение тэгов курсов
    static async getTagList(req, res) {
        const params = {
            database: "courses",
            collection: "tags",
        };

        try {
            const response = await Controller.service.getCollection(params);
            res.send(response.map((item) => new Tag(item)));
        } catch (err) {
            Controller.errorHandler(res, err);
        }
    }

    // Увеличение количества просмотров курса
    static async addView(req, res) {
        let params = {
            database: "courses",
            collection: "courses",
            filter: { id: req.body.id },
        };

        try {
            validator.isId(req.body.id);
            const response = await Controller.service.getDocument(params);

            validator.isCourse(response);
            params.operator = {
                $set: {
                    views: ++response.views,
                },
            }
            await Controller.service.updateDocument(params);
            
            res.send("Успешно!");
        } catch (err) {
            Controller.errorHandler(res, err);
        }
    }
}