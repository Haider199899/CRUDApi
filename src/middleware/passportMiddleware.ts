import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import { string } from 'yup';
import User, { IUser } from '../model/user.model';
import bcrypt from 'bcrypt'
import {ExtractJwt, Strategy} from 'passport-jwt';




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

passport.use('validate_jwt', new Strategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SERVER_TOKEN_SECRET
}, async (payload, done) => {
    console.log(payload);
    done({
        user: null,
        info: {

        }
    })
}));

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


// passport.use(
//     'admin',
//     new JWTStrategy(
//       {
//         jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
//         secretOrKey: process.env.PW_ENCRYPTION_KEY as string,
//       },
//       async (jwtPayload: any, cb: any) => {
//         // console.log(jwtPayload, 'jwtPayloadjwtPayload');
//         if (jwtPayload.hasOwnProperty('user_id')) {
//           const userInstance: AdminAccount | null = await (<IAdminAccountRepository>services.adminAccountService).getAdminAccountById({ user_id: jwtPayload.user_id });
//           if (!userInstance) {
//             return cb({
//               code: 401,
//               message: `User not found`
//             })
//           }
//           return cb(null, { ...jwtPayload });
//         } else {
//           return cb({
//             code: 401,
//             message: `Invalid token`
//           })
//         }
//       },
//     ),
//   );