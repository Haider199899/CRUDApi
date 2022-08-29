import mongoose from 'mongoose';
import {IHistory} from '../model/history.model';
import express ,{Request,Response} from 'express';
import asyncHandler from 'express-async-handler';
import History from '../model/history.model';
import Product from '../model/products.model';

const addHistory=async(req:Request,res:Response)=>{
    try{
    const history:any=new History(req.body);
    const product = await Product.findOne({ product_id: req.body.product_id });
  if (product === null) {
      const result = await history.save();
      if (result === null) {
          res.sendStatus(500);
      } else {
          res.status(201).json({ status: 201, data: result });
      }

  } else {
      res.sendStatus(422);
  }
}catch(error:any){
  return res.json({
    message:"History not added!",
    success:false
  })
}
};
const updateHistory = (async (req: Request, res: Response) => {
  try{
  const { id} = req.body as { id: string};
  const {product_name,currentPrice,previousPrice,outofStock,product_id}=
    req.body as {
      product_name: string;
      currentPrice:number;
      previousPrice:number;
      outofStock:boolean;
      product_id:string;
    
    };
 

  const product = await Product.findOneAndUpdate({product_id});


  if (product) {
    const history=new History();
    history.product_name =product_name;
    product.price=currentPrice;
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
    message:"Something is not valid!",
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
export{
  addHistory,
  updateHistory,
  deleteHistory
};