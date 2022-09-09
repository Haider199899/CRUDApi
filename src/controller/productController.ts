import Product from "../model/products.model";
import { Request, Response } from "express";

import { IProduct } from "../model/products.model";
import Inventory, { IInventory } from "../model/inventory.model";
import { ObjectId } from "mongoose";


//Adding the product
const addProduct=async(req: Request, res: Response)=> {
  try{
    let{product_name,brand,category,price,countInStock,outofStock}=req.body;
  const newProduct: IProduct = new Product({product_name,brand,category,price,countInStock,outofStock});
  let product_id=newProduct.id;
  const newInventory:IInventory|any=new Inventory({price,countInStock,outofStock,product_id});

  
     
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
  const { id } = req.body as { id: string };

  let product_id=id;
  
  const {product_name,  brand, category,price,countInStock,outofStock}=
    req.body as {
      product_name: string;
      price:number;
      brand: string;
      category: string;
      countInStock:number;
      outofStock:boolean;
    
    };
  const inventory=await Inventory.findOne({product_id});

  const product = await Product.findOne({id});
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
    console.log('calling')
  const {id } = req.body as {id: string };
  const product = await Product.findOne({id});
 // const inventory=await Inventory.findOne({product_id});

  if (product) {
    await product.remove();
    //await inventory.remove();
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

    async (req: Request, res: Response)=> {
      try{
        console.log('hii')
        let{id}=req.body as {id:String}
      const product: IProduct|any = await Product.findOne({id})
      if (!product) {
        return res.json({
        message:'Product not found',
        })
      }
      else{
      return res.json(product);
      }''
    }
  catch(error:any){
    return res.json({
      message:"Something is not valid!"+error,
      success:false
    })
  }
});
const get_Pro_Info=async(req:Request,res:Response)=>{
   let{product_id}=req.body as {product_id:string};
   try{
   const info=await Product.aggregate([
    
      { $match: { $expr : { $eq: [ '$_id' , { $toObjectId: product_id } ] } } },
    
    {
      $lookup:
      {
        from:'inventories',
        localField:'_id',
        foreignField:'product_id',
        as:'inventory'
      }
    },
    {
      $lookup:
      {
        from:'histories',
        localField:'_id',
        foreignField:'product_id',
        as:'history'
      }
    }



   ])
   return res.status(200).json({
    message:info,
    success:true
   })
  }catch(error:any){
    return res.status(400).json({
      message:'Operation not successful due to '+error,
      success:false
    })
  }
}
export {
  getProducts,
  getProductById,
  updateProduct,
  addProduct,
  deleteProduct,
  get_Pro_Info
};
