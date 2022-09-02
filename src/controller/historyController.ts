import mongoose from 'mongoose';
import {IHistory} from '../model/history.model';
import {Request,Response} from 'express';

import History from '../model/history.model';
import Product from '../model/products.model';
import { Aggregate } from 'mongoose';

const addHistory=async(req:Request,res:Response)=>{
    try{
      console.log('calling')
      let{product_name,previousPrice,currentPrice,outofStock,countInStock,product_id}=req.body;
      let _id=product_id;
    const history:IHistory|any=new History({product_name,previousPrice,currentPrice,outofStock,countInStock,product_id});
    const product = await Product.findById({ _id });
  if (product && previousPrice===product.price) {
    history.previousPrice=product.price;
    product.price=currentPrice;
    product.countInStock=history.countInStock;
      const result = await history.save();
      const resPro=await product.save();

      if (result === null) {
          res.sendStatus(500);
      } else {
          res.status(201).json({ status: 201, data: result });
      }

  } else {
      res.sendStatus(422).json({
        message:"Invalid entries "
      });
  }
}catch(error:any){
  return res.json({
    message:"History not added "+error,
    success:false
  })
}
};
const updateHistory = (async (req: Request, res: Response) => {
  try{
  const {product_name,currentPrice,previousPrice,countInStock,outofStock,product_id}=
    req.body as {
      product_name: string;
      currentPrice:number;
      previousPrice:number;
      countInStock:number;
      outofStock:boolean;
      product_id:string;
    
    };
   

 

    const product = await Product.findOne({product_id });


  if (product) {
    console.log('ok')
    const history=new History();
    history.product_name =product_name;
    product.price=currentPrice;
    product.countInStock=countInStock;
    history.currentPrice=currentPrice;
    history.previousPrice=previousPrice;
    history.outofStock=outofStock;

    const updatedProduct = await product.save();
    const updatedHistory=await history.save();
    res.status(201).json({
      message:'History updated!',
      success:true
    });
  } else {
    res.status(404);
    throw new Error("Product not found.");
  }
}catch(error:any){
  return res.json({
    message:"Something is not valid!"+error,
    success:false
  })
}
}
);
//delete history
const deleteHistory = (async (req: Request, res: Response) => {
  try{
  const { id } = req.body as { id: string };
  const history = await History.findOne({id});

  if (history) {
    await history.remove();
    res.json({ message: "History removed",
               success:true });
  } else {
    res.status(404);
    throw new Error("History not found");
  }
}catch(error:any){
  return res.json({
    message:"Something is not valid!",
    success:false
  })
}
});
const getHistoryById = (

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
const getHisByDate=(async(req:Request,res:Response)=>{
  try{
    let { product_id } = req.body as {product_id: string };
    let _id=product_id;
    console.log(_id)
  const history=await Product.findById({_id});
  if(history){
    let id=_id;
   const result=await History.aggregate([
     
     {
      $lookup:
      {
        from:"products",
       let: {product_id: '$product_id'},
        pipeline: [{$match: {
         $expr: {
          $eq: [
           '$_id', '$$product_id'
          ],
        }}}],
        as:"products"
      }
     }
    ]);
   return res.json({
      message:result,
      success:true
    })
  
  }
  }catch(error:any){
     return res.json({
      message:"error"+error
    })
  }

});
export{
  addHistory,
  updateHistory,
  deleteHistory,
  getHistoryById,
  getHisByDate
};