import Product from "../model/products.model";
import {Request,Response} from 'express';
import mongoose,{ObjectId} from 'mongoose';
import asyncHandler from 'express-async-handler';
import { IProduct,IReview } from "../model/products.model";


//Adding the products
const addProduct=(req:Request,res:Response)=>{
    let {name,brand,category,description,
         rating,numReviews,price,countInStock}=req.body;

    const _product = new Product({
            _id: new mongoose.Types.ObjectId(),
            name,
            brand,
            category,
            description,
            rating,
            numReviews,
            price,
            countInStock
        }); 
        return _product
        .save()
        .then((_product) => {
            return res.status(201).json({
                _product
            });
        })
        .catch((error:any) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });        
}
//Update the product
const updateProduct = asyncHandler(async (req:Request, res:Response) => {
    const { name, price, description,rating,numReviews, brand, category, countInStock } =
      req.body;
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    product.name = name;
    product.price = price;
    product.description = description;
    product.rating=rating;
    product.numReviews=numReviews;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;
  
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  });
  //Fetcing all products
  const getProducts = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const pageSize = 10;
      const page: number = Number(req.query.pageNumber) || 1;
  
      const keyword: any = req.query.keyword
        ? {
            name: {
              $regex: req.query.keyword,
              $options: 'i',
            },
          }
        : {};
      const count: number = await Product.countDocuments({ ...keyword });
      const products: (IProduct & {
        _id: ObjectId;
      })[] = await Product.find({ ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1));
  
      res.json({ products, page, pages: Math.ceil(count / pageSize) });
    }
  );
  //Ger Product by Id
  const getProductById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const product:
        | (IProduct & {
            _id: ObjectId;
          })
        | null = await Product.findById(req.params.id);
      if (!product) {
        res.status(404);
        throw new Error('Product not found');
      }
      res.json(product);
    }
  );
  export {
    getProducts,
    getProductById,
    updateProduct,
    addProduct
  };
  
  