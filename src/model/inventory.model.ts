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
//method for transforming _id and deleting useless info
inventorySchema.set("toJSON", {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});
 
const Inventory=mongoose.model('Inventory',inventorySchema);
export default Inventory;