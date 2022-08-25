import Product from "../model/products.model";
import { Request, Response } from "express";
import mongoose, { ObjectId } from "mongoose";
import asyncHandler from "express-async-handler";
import { IProduct } from "../model/products.model";
import bodyParser from "body-parser";


//Adding the products
const addProduct = (req: Request, res: Response) => {
  const productData: IProduct = req.body;
  const _product = new Product({
    ...productData,
    inventory:"630756a8794cc7fe16312e88"
    
    
  });
  return _product
    .save()
    .then((_product) => {
      return res.status(201).json({
        _product,
      });
    })
    .catch((error: any) => {
      return res.status(500).json({
        message: error.message,
        error,
      });
    });
};
//Adding product description to inventory

//Update the product

const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { product_id } = req.params as { product_id: string };
  const { name, description, brand, category}=
    req.body as {
      name: string;
      
      description: string;
      brand: string;
      category: string;
     
    
    };

  const product = await Product.findOneAndUpdate({product_id});

  if (product) {
    product.name = name;
   
    product.description = description;

    product.brand = brand;
    product.category = category;
  
    

    const updatedProduct = await product.save();
    res.status(201).json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found.");
  }
});
//Delete the product

const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  
  const { product_id } = req.body as { product_id: string };
  const product = await Product.findOne({product_id});

  if (product) {
    await product.remove();
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});
/*
const updateProduct = asyncHandler(async (req:Request, res:Response) => {
    const { _id,name, price, description,rating,numReviews, brand, category, countInStock } =
      req.body;
   const product = await Product.findById(parseInt(_id));
   if(mongoose.Types.ObjectId.isValid(_id)){
      
   }
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
  });*/
//Fetcing all products
const getProducts = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const pageSize = 10;
    const page: number = Number(req.query.pageNumber) || 1;

    const keyword: any = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
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
    const { product_id } = req.body as { product_id: string };
    const product = await Product.find({product_id});
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    res.json(product);
  }
);
export {
  getProducts,
  getProductById,
  updateProduct,
  addProduct,
  deleteProduct,
};
