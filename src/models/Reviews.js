export class Review {
  constructor(review) {
    this._id = review._id;
    this.score = review.score;
    this.text = review.text;
    this.name = review.name;
    this.date = review.date; 
  }
}