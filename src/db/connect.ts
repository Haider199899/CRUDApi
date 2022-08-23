import dotenv from 'dotenv';
import mongoose from 'mongoose';
import clc from 'cli-color';
import { Console } from 'console';


const connectDB = async (): Promise<void> => {
  try {
    const uri: string = process.env.MONGO_PATH as string;
    console.log(uri);
    const conn: any = await mongoose.connect(uri);
    console.log('MongoDB Connected');
    
  } catch (error:any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;