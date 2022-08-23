import mongoose, { Document } from 'mongoose';

const reveiwSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);
//interface for reviews of products
export interface IReview extends Document {
    name: any;
    rating: number;
    comment: string;
    user: any;
  }
  //interface for attributes of products

export interface IProduct extends Document {
    user: string;
    name: string;
    brand: string;
    category: string;
    description: string;
    rating: number;
    reviews: IReview[];
    countInStock: number;
    numReviews: number;
    price: number;
  }
  
const productSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    reviews: [reveiwSchema],
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  },
);

const Product = mongoose.model<IProduct>('Product', productSchema);
export default Product;