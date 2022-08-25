import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import bcrypt from 'bcrypt';
import User, { IUser } from '../model/user.model';
import jwt from 'jwt-simple';
import jsonwt from 'jsonwebtoken';

const NAMESPACE = 'User';

const validateToken = (req: Request, res: Response, next: NextFunction) => {
    console.log(NAMESPACE, 'Token validated, user authorized.');

    return res.status(200).json({
        message: 'Token(s) validated'
    });
};

const register = (req: Request, res: Response, next: NextFunction) => {
    let { name, email,password,confirmPassword } = req.body;

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
            confirmPassword,
        });

        return _user
            .save()
            .then((user:IUser) => {
                return res.status(201).json({
                    user
                });
            })
            .catch((error:any) => {
                return res.status(500).json({
                    message: error.message,
                    error
                });
            });
    });
};



const login=(req:Request,res:Response,next:NextFunction)=>{
    
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
                      jsonwt.sign(
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
    


    /*
    if(user)
    {
        res.json({user});
    }
    else{
        return res.status(500).json({
            message: "Incorrect user name or password!"
        });
    }*/

    // check email in db, if exist fetch data. otherwise Wrong username or password
    // hash password
    // compare password
    // create token
    // return response

    

/*
const login = (req: Request, res: Response, next: NextFunction) => {
    let { email, password } = req.body;

    User.find({ email  })
        .exec()
        .then((users) => {
            if (users.length !== 1) {
                return res.status(401).json({
                    message: 'Unauthorized'
                });
            }

            bcryptjs.compare(password, users[0].password, (error, result) => {
                if (error) {
                    return res.status(401).json({
                        message: 'Password Mismatch'
                    });
                } else if (result) {
                    signJWT(users[0], (_error, token) => {
                        if (_error) {
                            return res.status(500).json({
                                message: _error.message,
                                error: _error
                            });
                        } else if (token) {
                            return res.status(200).json({
                                message: 'Auth successful',
                                token: token,
                                user: users[0]
                            });
                        }
                    });
                }
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};*/

const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
    User.find()
        .select('-password')
        .exec()
        .then((users) => {
            return res.status(200).json({
                users: users,
                count: users.length
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

export default { validateToken, register, login, getAllUsers };