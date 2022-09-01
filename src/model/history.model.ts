import mongoose from "mongoose";

export interface IHistory extends Document {
  product_name:string,
  currentPrice: number;
  previousPrice:number;
  product_id:string;
  outofStock:boolean;
  countInStock:number;
  
  }
const historySchema=new mongoose.Schema(
    {
    product_name:{type:String,required:true},
    currentPrice: { type: Number, required: true, default: 0 },
    previousPrice: { type: Number, required: true, default: 0 },
    outofStock:{type:Boolean, required:true},
    countInStock:{type:Number,required:true},
    product_id:{type:mongoose.Schema.Types.ObjectId,ref:'Product'},
  
    }

);
historySchema.set("toJSON", {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});
const History=mongoose.model('History',historySchema);
export default History;