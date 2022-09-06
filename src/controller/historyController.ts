import mongoose from "mongoose";
import { IHistory } from "../model/history.model";
import { Request, Response } from "express";

import History from "../model/history.model";
import Product from "../model/products.model";
import { Aggregate } from "mongoose";
import Inventory, { IInventory } from "../model/inventory.model";
import { AnyAaaaRecord } from "dns";
import { date } from "joi";

const addHistory = async (req: Request, res: Response) => {
  try {
    console.log("calling");
    let {
      product_name,
      previousPrice,
      currentPrice,
      outofStock,
      countInStock,
      product_id,
    } = req.body;
    let _id = product_id;
    const history: IHistory | any = new History({
      product_name,
      previousPrice,
      currentPrice,
      outofStock,
      countInStock,
      product_id,
    });
    const product = await Product.findById({ _id });
    if (product) {
      const inventory: IInventory | any = await Inventory.findOne({
        product_id,
      });
      history.previousPrice = product.price;
      product.price = currentPrice;
      product.countInStock = history.countInStock;
      inventory.price = currentPrice;
      inventory.countInStock = history.countInStock;
      const result = await history.save();
      const resPro = await product.save();
      const resInven = await inventory.save();

      if (result === null) {
        res.sendStatus(500).json({
          meaasge: "Invalid entry take a look at product collection",
        });
      } else {
        res.status(201).json({ status: 201, data: result });
      }
    } else {
      res.sendStatus(422).json({
        message: "Invalid entries ",
      });
    }
  } catch (error: any) {
    return res.json({
      message: "History not added " + error,
      success: false,
    });
  }
};
const updateHistory = async (req: Request, res: Response) => {
  try {
    const {
      product_name,
      currentPrice,
      previousPrice,
      countInStock,
      outofStock,
      product_id,
    } = req.body as {
      product_name: string;
      currentPrice: number;
      previousPrice: number;
      countInStock: number;
      outofStock: boolean;
      product_id: string;
    };
    const product = await Product.findOne({ product_id });
    const inven = await Inventory.findOne({ product_id });
    const history = await History.findOne({ product_id });

    if (product && history) {
      if (inven) {
        console.log("helo");
        history.product_name = product_name;
        product.price = currentPrice;
        product.countInStock = countInStock;
        inven.price = currentPrice;
        inven.countInStock = countInStock;
        history.currentPrice = currentPrice;
        history.previousPrice = previousPrice;
        history.outofStock = outofStock;

        const updatedProduct = await product.save();
        const updatedHistory = await history.save();
        const updatedInventory = await inven.save();
        res.status(201).json({
          message: "History updated!",
          success: true,
        });
      }
    } else {
      res.status(404);
      throw new Error("Product not found.");
    }
  } catch (error: any) {
    return res.json({
      message: "Something is not valid!" + error,
      success: false,
    });
  }
};
//delete history
const deleteHistory = async (req: Request, res: Response) => {
  try {
    const { id } = req.body as { id: string };
    const history = await History.findOne({ id });

    if (history) {
      await history.remove();
      res.json({ message: "History removed", success: true });
    } else {
      res.status(404);
      throw new Error("History not found");
    }
  } catch (error: any) {
    return res.json({
      message: "Something is not valid!",
      success: false,
    });
  }
};
const getHistoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.body as { id: string };
    const product = await Product.find({ id });
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    res.json(product);
  } catch (error: any) {
    res.json({
      message: "Something is not valid!",
      success: false,
    });
  }
};
const getHisByDate = async (req: Request, res: Response) => {
  try {
    let { date_from, date_to } = req.body as {
      date_from: Date;
      date_to: Date;
    };

    const result = await History.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(date_from),
            $lte: new Date(date_to),
          },
        },
      },

      {
        $lookup: {
          from: "products",
          localField: "product_id",
          foreignField: "_id",
          as: "info",
        },
      },
      {
        $lookup:
      {
        from: 'inventories',
        localField: 'product_id',
        foreignField: 'product_id',
        as: 'result'
      }
    }

      
    
    ]);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.json({
      message: "error" + error,
    });
  }
};
const getHisByMonth = async (req: Request, res: Response) => {
  try {
    
    const result = await History.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              {
                "$eq": [
                  {
                    $month: "$createdAt"
                  },
                  {
                    $month: {
                      $dateAdd: {
                        startDate: new Date(),
                        unit: "month",
                        amount: -1
                      }
                    }
                  }
                ]
              },
              {
                "$eq": [
                  {
                    $year: "$createdAt"
                  },
                  {
                    $year: {
                      $dateAdd: {
                        startDate: new Date(),
                        unit: "month",
                        amount: -1
                      }
                    }
                  }
                ]
              }
            ]
          }
        }
         
      },
      {
        $lookup: {
          from: "products",
          localField: "product_id",
          foreignField: "_id",
          as: "info",
        },
      },
      {
        $lookup:
      {
        from: 'inventories',
        localField: 'product_id',
        foreignField: 'product_id',
        as: 'result'
      }
    }
    ]);

    return res.json({
      data: result,
      success: true,
    });
  } catch (error: any) {
    return res.json({
      message: error,
      success: false,
    });
  }
};
export {
  addHistory,
  updateHistory,
  deleteHistory,
  getHistoryById,
  getHisByDate,
  getHisByMonth,
};
