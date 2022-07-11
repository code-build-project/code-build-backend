export default class MessageError extends Error {
    constructor(type, message, status, field) {
        super();
        this.type = type;
        this.name = "Bad Request";
        this.message = message;
        this.status = status;
        this.field = field;
    }
}