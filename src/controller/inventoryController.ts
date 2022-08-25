import mongoose from "mongoose";
import Inventory, { IInventory } from "../model/inventory.model";
import express ,{Request,Response} from 'express';

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
   export {
    addInventory
   } ;

