export default class MessageError extends Error {
    constructor(type, message, status) {
        super(message);
        this.type = type;
        this.name = "MessageError";
        this.status = status;
    }
}