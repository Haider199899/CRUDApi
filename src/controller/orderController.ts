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
    const {
      orderItems,
      user,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice,
    }: {
      orderItems: IOrderItems[];
      user:string;
      shippingAddress: string;
      paymentMethod: string;
      taxPrice: number;
      shippingPrice: number;
      totalPrice: number;
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
      });
      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    }
  }
);

// @desc Get order by Id
// @desc route GET /api/orders/:id
// @access Private
const getOrderById = (
  
  async (req: Request, res: Response): Promise<void> => {
    try{
    const order: any = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }
    res.status(200).json(order);
  }
catch(error:any){
  res.json({
    message:"Something is not valid!",
    success:false
  })
}
});


// @desc Get logged in user orders
// @desc route GET /api/orders/myorders
// @access Private
const getMyOrders = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try{
    const orders: (IOrder & {
      _id: ObjectId;
    })[] = await Order.find({ user: req.params.id });
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


export {
  addOrderItems,
  getOrderById,
  getAllOrders,
  getMyOrders
};
