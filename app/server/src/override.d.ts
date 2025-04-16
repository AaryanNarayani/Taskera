import * as express from 'express';

interface UserPayload {
  id: string;
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