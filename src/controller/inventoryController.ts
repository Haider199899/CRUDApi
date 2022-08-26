import mongoose from "mongoose";
import Inventory, { IInventory } from "../model/inventory.model";
import express ,{Request,Response} from 'express';
import asyncHandler from 'express-async-handler';
import Product from "../model/products.model";

const addInventory=(req:Request,res:Response)=>{
    const inventoryData: IInventory = req.body;
    const _inventory = new Inventory({
        ...inventoryData,
        _id:new mongoose.Types.ObjectId

        
      });
      return _inventory
    .save()
    .then((_inventory) => {
      return res.status(201).json({
        _inventory,
      });
    })
    .catch((error: any) => {
      return res.status(500).json({
        message: error.message,
        error,
      });
    });
};
//update inventory
const updateInventory = asyncHandler(async (req: Request, res: Response) => {
    const { product_id } = req.params as { product_id: string };
    const { name, description, brand, category,price,countInStock}=
      req.body as {
        name: string;
        price:number;
        countInStock:number;
        
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
      product.inventory="630756a8794cc7fe16312e88";
      
    
      
  
      const updatedProduct = await product.save();
      res.status(201).json(updatedProduct);
    } else {
      res.status(404);
      throw new Error("Product not found.");
    }
  });


   export {
    addInventory,
    updateInventory
   } ;

