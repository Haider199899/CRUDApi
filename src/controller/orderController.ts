import Order from "../model/orders.model";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import {
  IOrder,
  IOrderItems,
 
} from "../model/orders.model";
import { ObjectId } from "mongoose";

// @desc Create new order
// @desc route POST /api/orders
// @access Private
const addOrderItems = (
  async (req: any, res: Response): Promise<void> => {
    try{
      console.log('calling!');
    const {
      orderItems,
      user,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid,
      paidAt,
      isDelievered,
      delieveredAt
    }: {
      orderItems: IOrderItems[];
      user:string;
      shippingAddress: string;
      paymentMethod: string;
      taxPrice: number;
      shippingPrice: number;
      totalPrice: number;
      isPaid:boolean;
      paidAt:Date;
      isDelievered:boolean;
      delieveredAt:Date;
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
    } else {
      const order = new Order({
        orderItems,
        user,
        shippingAddress,
        paymentMethod,
        taxPrice,
        shippingPrice,
        totalPrice,
        isPaid,
        paidAt,
        isDelievered,
        delieveredAt
      });
      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    }
  
  }catch(error:any){
     res.json({
      message:'Invalid entry',
      success:false
    });
   
  }

});

// @desc Get order by Id
// @desc route GET /api/orders/:id
// @access Private
const getOrderById = (
  
  async (req: Request, res: Response): Promise<void> => {
    try{
      let{id}=req.body as {id:String}
    const order: IOrder|any = await Order.findOne({id})
    if (!order) {
      res.status(404).json({
      message:'Order not found',
      })
    }
    res.status(200).json(order);
  }
catch(error:any){
  res.json({
    message:"Something is not valid!"+error,
    success:false
  })
}
});


// @desc Get logged in user orders
// @desc route GET /api/orders/myorders
// @access Private
const getMyOrders = (
  async (req: Request, res: Response): Promise<void> => {
    try{
    const orders: (IOrder & {
      _id: ObjectId;
    })[] = await Order.find({ user: req.body.id });
    if(orders){
    res.json(orders);
    }else{
      res.json({
        message:"Order not found!",
        success:false
      })
    }
  }
catch(error:any){
  res.json({
    message:"Something is not valid due to "+error,
    success:false
  })
}
  }
);

// @desc Get all orders
// @desc route GET /api/orders
// @access Private/Admin
const getAllOrders = asyncHandler(async ({}, res: Response): Promise<void> => {
  const orders: any[] = await Order.find().populate("user", "id name");
  res.json(orders);
});
const get_user_order=async(req:Request,res:Response)=>{
  try{
  let {user_id}=req.body as {user_id:string};
  
  const result=await Order.aggregate([
    { $match: { $expr : { $eq: [ '$user' , { $toObjectId: user_id } ] } } },
    {
      $lookup:{
        from:'products',
        localField:'orderItems.product_id',
        foreignField:'_id',
        as:'product_info'
      }
    }
  ])
  return res.status(200).json({
    product_info:result,
    success:true
  })
}catch(error:any){
  return res.status(400).json({
  message:'Invalid operation',
  success:false
  })
}
}


export {
  addOrderItems,
  getOrderById,
  getAllOrders,
  getMyOrders,
  get_user_order
};
