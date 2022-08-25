import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const SECRET_KEY: Secret = 'superSecret';

export interface CustomRequest extends Request {
 token: string | JwtPayload;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
 try {
   const token = req.header('Authorization')?.replace('Bearer ', '');

   if (!token) {
     throw new Error();
   }

   const decoded = jwt.verify(token, SECRET_KEY);
   (req as CustomRequest).token = decoded;

   next();
 } catch (err) {
   res.status(401).send('Please authenticate');
 }
};
/*import jwt from "jsonwebtoken";
import User from "../model/user.model";
import expressAsyncHandler from "express-async-handler";
import { NextFunction, Response } from "express";

const protect = expressAsyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];
        console.log(token);
        const decoded: any = jwt.verify(
          token,
          process.env.JWT_SECRET ? process.env.JWT_SECRET : "secret"
        );
        req.user = await User.findById(decoded.id).select("-password");
        next();
      } catch (error) {
        console.error(error);
        res.status(401);
        throw new Error("Unauthorized, token failed");
      }
    }
    if (!token) {
      res.status(401);
      throw new Error("You are not logged in!");
    }
  }
);

const admin = (req: any, res: Response, next: NextFunction) => {
  if (req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("You are not authorized to perform this action");
  }
};

export { protect, admin };*/

