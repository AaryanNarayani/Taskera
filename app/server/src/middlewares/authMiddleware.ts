import jwt from 'jsonwebtoken';
import { Request, Response } from "express";
import { UserPayload } from '../override';

export const authMiddleware = (
    req: any,
    res: Response,
    next: () => void
  ): void => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: "Invalid authorization header. Use 'Bearer <token>'" });
      return;
    }
  
    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as UserPayload; 
      req.user = decoded;
      req.user.uuid = decoded.id;
      next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
        return;
    }
};