import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

import { Request, Response, NextFunction } from 'express';

const NAMESPACE = 'Auth';

const extractJWT = (req: Request, res: Response, next: NextFunction) => {
console.log(NAMESPACE, 'Validating token');

    let token = req.headers.authorization?.split(' ')[1];

    if (token) {
        jwt.verify(token, 'superSecret', (error:any, decoded:any) => {
            if (error) {
                return res.status(404).json({
                    message: error,
                    error
                });
            } else {
                res.locals.jwt = decoded;
                next();
            }
        });
    } else {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
};

export default extractJWT;