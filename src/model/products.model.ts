import mongoose, { Document } from 'mongoose';
import inventoryModel from './inventory.model';
import { IInventory } from './inventory.model';


  //interface for attributes of products

export interface IProduct extends Document {
   
    product_id: string;
    name: string;
    brand: string;
    category: string;
    description: string;
    
    
    inventory:any;
    
  }



  
  
const productSchema = new mongoose.Schema(
  {
   
    product_id: { type: String, required: true,unique:true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
  
    
    inventory:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'Inventory'},//refernce of inventory
  },
  {
    timestamps: true,
  },
);

const Product = mongoose.model<IProduct>('Product', productSchema);
export default Product;