import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import bcrypt from 'bcrypt';
import path from 'path';
import User, { IUser } from '../model/user.model';
import dotenv from 'dotenv';
dotenv.config({path: path.join(__dirname, '..', '.env')});

import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';


const register = (req: Request, res: Response) => {
    let { name, email,password,isAdmin } = req.body;

    bcryptjs.hash(password, 10, (hashError, hash) => {
        if (hashError) {
            return res.status(401).json({
                message: hashError.message,
                error: hashError
            });
        }

        const _user:IUser = new User({
            _id: new mongoose.Types.ObjectId(),
            name,
            email,
            password: hash,
            isAdmin,
         
        })
    
      
        const token = jwt.sign(_user.toJSON(),'superencryptedsecret' , {expiresIn:process.env.SERVEE_TOKEN_EXPIRETIME});
        

        return _user
            .save()
            .then((user:IUser) => {
                if(isAdmin===true){
                return res.status(201).json({
                    user,
                    success:true,
                    token:token,
                    message:"Admin registered successfully"})
                }else{
                    return res.status(201).json({
                        user,
                        success:true,
                        token:token,
                        message:"User registered successfully"


                })
            }
        }
    )
   .catch((error:any) => {
                return res.status(500).json({
                    message: error.message,
                    error
                });
            });
    });
};



const login=(req:Request,res:Response)=>{
    
    const email = req.body.email
    const password= req.body.password
     
    

    //find user exist or not
    User.findOne({ email })
        .then(user => {
            //if user not exist than return status 400
            if (!user) return res.status(400).json({ msg: "User not exist" });

            //if user exist than compare password
            //password comes from the user
            //user.password comes from the database
            bcrypt.compare(password, user.password, (err, data) => {
                //if error than throw error
                if (err) throw err

                //if both match than create the token
                if (data) {
                    
                    const payload = {
                        id: user._id,
                        name: user.name,
                        email: user.email
                      };
                      jwt.sign(
                        payload,
                        'mySecret',
                        { expiresIn: 3600 },
                        (err, token) => {
                          res.json({
                            message:`User id:${user._id} Email:${user.email}`,
                            success: true,
                            token: token
                            
                          });
                        }
                      );
            
                } else {
                    return res.status(401).json({ msg: "Invalid credencial" })
                }
               
                

            });

        });

    }
    //fetch user profile
const profile=(req:Request,res:Response)=>{
    const email = req.body.email
    const password= req.body.password
    const isAdmin=new Boolean(req.body.isAdmin);
     
    
     if(isAdmin===true){
    //find user exist or not
    User.findOne({ email })
        .then(user => {
            //if user not exist than return status 400
            if (!user) return res.status(400).json({ msg: "Admin not exist" });

            //if user exist than compare password
            //password comes from the user
            //user.password comes from the database
            bcrypt.compare(password, user.password, (err, data) => {
                //if error than throw error
                if (err) throw err

                //if both match than create the token
                if (data) {
                    
                    const payload = {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        isAdmin:user.isAdmin
                      };
                      jwt.sign(
                        payload,
                        'adminSecret',
                        { expiresIn: 3600 },
                        (err, token) => {
                          res.json({
                            message:`User id:${user._id}  Email:${user.email}  Admin:${user.isAdmin}`,
                            success: true,
                            token: token
                            
                          });
                        }
                      );
            
                } else {
                    return res.status(401).json({ msg: "Invalid credencial" })
                }
               
                

            });

        });

    }
    else{
        User.findOne({ email })
        .then(user => {
            //if user not exist than return status 400
            if (!user) return res.status(400).json({ msg: "Admin not exist" });

            //if user exist than compare password
            //password comes from the user
            //user.password comes from the database
            bcrypt.compare(password, user.password, (err, data) => {
                //if error than throw error
                if (err) throw err

                //if both match than create the token
                if (data) {
                    
                    const payload = {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        isAdmin:user.isAdmin
                      };
                      jwt.sign(
                        payload,
                        'userSecret',
                        { expiresIn: 3600 },
                        (err, token) => {
                          res.json({
                            message:`User id:${user._id}  Email:${user.email}  Admin:${user.isAdmin}`,
                            success: true,
                            token: token
                            
                          });
                        }
                      );
            
                } else {
                    return res.status(401).json({ msg: "Invalid credencial" })
                }
               
                

            });

        });


    }
}


   
export default { register, login};