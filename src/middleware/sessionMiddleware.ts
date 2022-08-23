import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import {Request,Response,NextFunction} from 'express';
dotenv.config();
const sessionMiddleware=(req:Request,res:Response,next:NextFunction)=>{
    return session({
        secret:'superSecret',
        resave:false,
        saveUninitialized:true,
    })(req,res,next);

};
export default sessionMiddleware;