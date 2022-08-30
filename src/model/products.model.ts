import mongoose, { Document } from 'mongoose';

//interface for attributes of products
export interface IProduct extends Document {
    
    product_id:string;
    product_name: string;
    brand: string;
    category: string;
    price:number;
    countInStock:number;
    inventory_id:any;
    
  }

  const productSchema = new mongoose.Schema(
  {
    product_id:{type: String,unique:true, required: true },
    product_name: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    countInStock:{ type: Number, required: true },
    inventory_id:{type:mongoose.Schema.Types.ObjectId,ref:'Inventory'},//refernce of inventory
  },
  {
    timestamps: true,
  },
);
//method for transforming id and deleting useless info
productSchema.set("toJSON", {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});
 

const Product = mongoose.model<IProduct>('Product', productSchema);
export default Product;