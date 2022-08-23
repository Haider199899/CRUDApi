import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import config from 'config';
import { stringify } from 'querystring';
export interface IUser extends mongoose.Document{
    name:string;
    email:string;
    password:string;
    confirmPassword:string;
    createdAt:Date;
    updatedAt:Date;
    matchPassword(candidatePassword:string):Promise<boolean>;//Methodn definition for comparing 
    //password that return promise as boolean 
}

  
const userSchema=new mongoose.Schema(
    {
        name:{type:String,required:true},
        email:{type:String,required:true,unique:true},
        password:{type:String,required:true},
        confirmPassword:{type:String,required:true}
    },
    {timestamps:true}
);
 userSchema.methods.matchPassword= async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};
  
export default mongoose.model<IUser>('User',userSchema);
