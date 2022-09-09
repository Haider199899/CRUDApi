import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import bcrypt from "bcrypt";
import path from "path";
import User, { IUser } from "../model/user.model";
import dotenv from "dotenv";
import JWTR from 'jwt-redis';
dotenv.config({ path: path.join(__dirname, "..", ".env") });
import jwt from "jsonwebtoken";
import * as redis from "redis";


const register = async (req: Request, res: Response) => {
  console.log("calling!");
  let { name, email, password, isAdmin } = req.body;

  // use passport JS
  const user = await User.findOne({ email });
  if (!user) {
    bcryptjs.hash(password, 10, (hashError, hash) => {
      if (hashError) {
        return res.status(401).json({
          message: hashError.message,
          error: hashError,
        });
      }

      const _user: IUser = new User({
        _id: new mongoose.Types.ObjectId(),
        name,
        email,
        password: hash,
        isAdmin,
      });

      const token = jwt.sign(_user.toJSON(), "superencryptedsecret", {
        expiresIn: "365d",
      });

      return _user
        .save()
        .then((user: IUser) => {
          if (isAdmin === true) {
            return res.status(201).json({
              user,
              success: true,
              token: token,
              message: "Admin registered successfully",
            });
          } else {
            return res.status(201).json({
              user,
              success: true,
              token: token,
              message: "User registered successfully",
            });
          }
        })
        .catch((error: any) => {
          return res.status(500).json({
            message: error.message,
            error,
          });
        });
    });
  } else {
    return res.status(500).json({
      message: "email already exist",
      success: false,
    });
  }
};
//Redis-SignUp
const SignUp =  async(req: Request, res: Response) => {
  try {
   let{name,email,key}=req.body as{
    name:String;
    email:String;
    key:String
   }
   let data={key,name,email};
   let reds:any = redis.createClient();
   
    

    //To check if error
    reds.on("error", (error:any) => console.error(`Error : ${error}`));
    //else connect
    reds.on("connect", () => console.log("connection established"));
    await reds.connect();
   
    let isCached = false;
    let results;
    

   
    const exist_key=await reds.exists(`${key}`);
  

 if (!(exist_key)) {
     
    const info = await reds.hSet(`${key}`,req.body.name,req.body.email);
      isCached = true;
      results = JSON.parse(JSON.stringify({info}));
      return res.send({
        redis_data: results,
        success: true,
        fromCache: isCached,
      });
    }
    else{
      return res.json({
        message:'User already exist with same key or email!',
        success:false
      })
    }
  } catch (error: any) {
    return res.status(400).json({
      message: "Invalid operation " + error,
      success: false,
    });
  }
};
//Redis-Login
const LogIn=async(req:Request,res:Response)=>{
    try{
      let key=req.body.key;
     let reds=redis.createClient();
     reds.on("error", (error:any) => console.error(`Error : ${error}`));
     //else connect
     reds.on("connect", () => console.log("connection established"));
     await reds.connect();
     let isCached = false;
     let results;
 
 
     const user_info = await reds.hGetAll(`${key}`);
     const isEmpty = Object.keys(user_info).length === 0;
     if (!isEmpty) {
      //creating the token
     let secret = 'secret';
     let jti = 'test';
     let payload = { jti };
     const token =  jwt.sign(payload, secret);
     console.log(token)
       isCached = true;
       results = JSON.parse(JSON.stringify({user_info}));
      // await reds.set(req.body, JSON.stringify(results));
       return res.send({
         redis_data: results,
         success: true,
         fromCache: isCached,
         status:'User is logged in!',
         token:token
       });
     }
     else{
      return res.json({
        message:'User not availabale!'
      })
     }
    }catch(error:any){
     return res.json({
      message:'Error: '+error,
      success:false
     })
  }
}

const login = async(req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;

  // let id = req.user.id

  // User.findById({id})

  //passport js use
  //find user exist or not
  User.findOne({ email }).then((user) => {
    //if user not exist than return status 400
    if (!user) return res.status(400).json({ msg: "User not exist" });

    //if user exist than compare password
    //password comes from the user
    //user.password comes from the database
    bcrypt.compare(password, user.password, (err, data) => {
      //if error than throw error
      if (err) throw err;

      //if both match than create the token
      if (data) {
        const payload = {
          id: user._id,
          name: user.name,
          email: user.email,
        };
        jwt.sign(payload, "mySecret", { expiresIn: 3600 }, (err, token) => {
          return res.status(201).json({
            message: `User id:${user._id} Email:${user.email}`,
            success: true,
            token: token,
          });
        });
      } else {
        return res.status(401).json({ msg: "Invalid credencial" });
      }
    });
  });
};
//fetch user profile
const profile = (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  const isAdmin = new Boolean(req.body.isAdmin);

  if (isAdmin === true) {
    //find user exist or not
    User.findOne({ email }).then((user) => {
      //if user not exist than return status 400
      if (!user) return res.status(400).json({ msg: "Admin not exist" });

      //if user exist than compare password
      //password comes from the user
      //user.password comes from the database
      bcrypt.compare(password, user.password, (err, data) => {
        //if error than throw error
        if (err) throw err;

        //if both match than create the token
        if (data) {
          const payload = {
            id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
          };
          jwt.sign(
            payload,
            "adminSecret",
            { expiresIn: 3600 },
            (err, token) => {
              res.json({
                message: `User id:${user._id}  Email:${user.email}  Admin:${user.isAdmin}`,
                success: true,
                token: token,
              });
            }
          );
        } else {
          return res.status(401).json({ msg: "Invalid credencial" });
        }
      });
    });
  } else {
    User.findOne({ email }).then((user) => {
      //if user not exist than return status 400
      if (!user) return res.status(400).json({ msg: "Admin not exist" });

      //if user exist than compare password
      //password comes from the user
      //user.password comes from the database
      bcrypt.compare(password, user.password, (err, data) => {
        //if error than throw error
        if (err) throw err;

        //if both match than create the token
        if (data) {
          const payload = {
            id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
          };
          jwt.sign(payload, "userSecret", { expiresIn: 3600 }, (err, token) => {
            res.json({
              message: `User id:${user._id}  Email:${user.email}  Admin:${user.isAdmin}`,
              success: true,
              token: token,
            });
          });
        } else {
          return res.status(401).json({ msg: "Invalid credencial" });
        }
      });
    });
  }
};

export default { register, login, SignUp,LogIn };
