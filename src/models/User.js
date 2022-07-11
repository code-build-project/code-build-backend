export default class User {
    constructor(user) {
        this.id = user.id || user._id;
        this.name = user.name;
        this.email = user.email;
        this.isPremium = user.isPremium;
    }
}