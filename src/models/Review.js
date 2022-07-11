export default class Review {
    constructor(review) {
        this.id = review.id;
        this.score = review.score;
        this.text = review.text;
        this.name = review.name;
        this.date = review.date;
        this.image = review.image;
    }
}