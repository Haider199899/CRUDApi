import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import { string } from 'yup';
import User, { IUser } from '../model/user.model';
import bcrypt from 'bcrypt'



passport.use(
    new LocalStrategy({
        usernameField:"email",
        passwordField:"password"
    },
    //anonymous verification function
    async (email,password,done)=>{
     //to check if user exists
      const user=await User.findOne({email});
      
      //if credentials are valid
      //@ts-ignore
      if(user && await (user.matchPassword(password))) done(user,null);
      else done(null,false);
    }
    ) 
);

passport.serializeUser((user:any,done)=>{
    console.log('helo');
    done(null,{_id:user._id});

});
passport.deserializeUser(async(id:string,done:any)=>{
    try{
    const user=await User.findById(id);
    done(null,user);
    }catch(error){
        done(error);
    }
});
export default passport;