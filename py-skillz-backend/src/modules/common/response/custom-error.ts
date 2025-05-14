export class CustomError {
  statusCode: number;
  message: Array<string>;
  error: string;

  constructor(statusCode: number, message: Array<string>, error: string) {
    this.statusCode = statusCode;
    this.message = message;
    this.error = error;
  }
}
