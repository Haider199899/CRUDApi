import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import config from 'config';
import { stringify } from 'querystring';
import controller from '../controller/user.controller';
export interface IUser extends mongoose.Document{
    name:string;
    email:string;
    password:string;
    isAdmin:Boolean;
    createdAt:Date;
    updatedAt:Date;
    matchPassword(candidatePassword:string):Promise<boolean>;
    //Methodn definition for comparing 
    //password that return promise as boolean 
}

  
const userSchema=new mongoose.Schema(
    {
        name:{type:String,required:true},
        email:{type:String,required:true,unique:true},
        password:{type:String,required:true},
        isAdmin:{type:Boolean,required:true}
       
    },
    {
      timestamps:true
    }
   
);

userSchema.set("toJSON", {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});
 userSchema.methods.matchPassword= async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

  
export default mongoose.model<IUser>('User',userSchema);
