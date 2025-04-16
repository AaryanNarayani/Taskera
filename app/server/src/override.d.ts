import * as express from 'express';

interface UserPayload {
  uuid: string;
  email: string;
  // other user properties you include in the JWT
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}