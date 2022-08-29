import passport from 'passport';
import passportLocal from "passport-local";
import passportJwt from "passport-jwt";
import User, { IUser } from '../model/user.model';
import controller from '../controller/user.controller';
import dotenv from 'dotenv';
dotenv.config()

const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;




passport.use('login',
    new LocalStrategy({
        usernameField:"email",
        passwordField:"password",
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
    ) ;
    passport.use('signup',
    new LocalStrategy({
        usernameField:"email",
        passwordField:"password",
      
    },
    //anonymous verification function
    async (email,password,done)=>{
     //to check if user exists
      const user=await User.findOne({email});
      
      
      
      //if credentials are not valid
      //@ts-ignore
      if(!user){
        
        controller.register;

        done(user,null);
      }
      else done(null,false);
    }
    )
    ) ;

  //Strategy for getting user information-JWT Strategy
  
  passport.use(new JwtStrategy(
    {
      
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SERVER_TOKEN_SECRET
    }, function (jwt_payload, done) {

      User.findOne({ id: jwt_payload._doc._id}, function (err:any, user:IUser) {
        if (err) { return done(err, false); }
        if(!user){
          return done(null,false)
        }
         return done(null,user)
      
      });
    }));
  

passport.serializeUser((user:any,done)=>{
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