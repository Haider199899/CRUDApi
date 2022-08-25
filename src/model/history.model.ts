import mongoose from "mongoose"

export interface IHistory extends Document {
  product_id:String,
  brand: string;
  category: string;
  description: string;
  rating: number;
  numReviews: number;
  current_price: number;
  previous_price:number;
  
  }
const historySchema=new mongoose.Schema(
    {
    product_id:{type:String,required:true},
    
    brand: { type: String, required: true },
    category: { type: String, required: true },
    
  
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    current_price: { type: Number, required: true, default: 0 },
    previous_price: { type: Number, required: true, default: 0 },
    product:{type:mongoose.Schema.Types.ObjectId,ref:'Product'},
  
    }

);
const History=mongoose.model('History',historySchema);
export default History;