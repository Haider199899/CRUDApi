import Product from "../model/products.model";
import { Request, Response } from "express";
import  { ObjectId } from "mongoose";
import { IProduct } from "../model/products.model";
import Inventory, { IInventory } from "../model/inventory.model";

//Adding the product
const addProduct=async(req: Request, res: Response)=> {
  try{
    let{product_id,product_name,brand,category,price,countInStock}=req.body;
  const newProduct: IProduct = new Product({product_id,product_name,brand,category,price,countInStock});
  const newInventory:IInventory|any=new Inventory({product_id,price,countInStock});
     
      const product = await newProduct.save();

      const inven=await newInventory.save();
      if (product != null) {
          res.status(201).json({ status: 201, data: product });
      }

  else {
      res.sendStatus(422);
  }
}catch(error:any){
  return res.json({
    message:"Something is not valid due to "+error,
    success:false
  })
}
}


//Update the product

const updateProduct = (async (req: Request, res: Response) => {
  try{
  const { product_id } = req.body as { product_id: string };
  
  const {product_name,  brand, category,price,countInStock}=
    req.body as {
      product_name: string;
      price:number;
      brand: string;
      category: string;
      countInStock:number;
    
    };
  const inventory=await Inventory.findOneAndUpdate({product_id});

  const product = await Product.findOneAndUpdate({product_id});
  if (product && inventory) {
    product.product_name =product_name;
    product.price=price;
    product.brand = brand; 
    product.category = category;
    product.countInStock=countInStock;
    inventory.price=product.price;
    inventory.countInStock=product.countInStock;

    const updatedProduct = await product.save();
    const updatedInventory=await inventory.save();
    res.status(201).json(`Updated Product and Inventory:${updatedProduct},${updatedInventory}`);
  } else {
    res.status(404);
    throw new Error("Product not found.");
  }
}catch(error:any){
  return res.json({
    message:"Something is not valid dut to "+error,
    success:false
  })
}
}
);
//Delete the product

const deleteProduct = (async (req: Request, res: Response) => {
  try{
  const {product_id } = req.body as { product_id: string };
  const product = await Product.findOne({product_id});
  const inventory=await Inventory.findOne({product_id});

  if (product && inventory) {
    await product.remove();
    await inventory.remove();
    res.json({ message: "Product removed",
               success:true });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
}catch(error:any){
  return res.json({
    message:"Something is not valid!",
    success:false
  })
}
});

//Fetcing all products
const getProducts = ( async (req: Request, res: Response): Promise<void> => {
    try{
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
catch(error:any){
  res.json({
    message:"Something is not valid!",
    success:false
  })
}
});
//Ger Product by Id
const getProductById = (

  async (req: Request, res: Response): Promise<void> => {
    try{
    const { id } = req.body as {id: string };
    const product = await Product.find({id});
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    res.json(product);
  }
catch(error:any){
   res.json({
    message:"Something is not valid!",
    success:false
  })
}
});
export {
  getProducts,
  getProductById,
  updateProduct,
  addProduct,
  deleteProduct,
};
