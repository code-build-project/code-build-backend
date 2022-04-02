export class MessageError {
  constructor(name, message, status) {
    this.data = {
      name: name,
      message: message,
    }
    this.status = status;
  }
}
