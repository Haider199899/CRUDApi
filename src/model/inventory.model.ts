import mongoose from "mongoose"

export interface IInventory extends Document {
  
  price:Number,
  countInStock:Number,
  
  }
const inventorySchema=new mongoose.Schema(
    {
   
    price:{type:Number,required:true},
    countInStock: { type: Number, required: true, default: 0 }
    },
    {
      timestamps:true
    },

);
const Inventory=mongoose.model('Inventory',inventorySchema);
export default Inventory;