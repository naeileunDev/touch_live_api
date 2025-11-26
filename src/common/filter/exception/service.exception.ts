import { MESSAGE_TEXT } from "../config/message-text.config";

export class ServiceException extends Error {
  readonly statusCode: number;

  constructor(statusCode: number) {
    const message = MESSAGE_TEXT[statusCode]
    super(message);
    
    this.statusCode = statusCode;
  }
}