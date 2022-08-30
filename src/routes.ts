import { application, Express, Request, Response } from "express";
import controller from "./controller/user.controller";
import {
  addProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "./controller/productController";

import User from "./model/user.model";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import { IUser } from "./model/user.model";

import {
  addOrderItems,
  getAllOrders,
  getOrderById,
  getMyOrders,
} from "./controller/orderController";
import passport from "passport";
//import { addInventory } from './controller/inventoryController';
import "./middleware/passportMiddleware";
import {
  addHistory,
  updateHistory,
  deleteHistory,
  getHistoryById,
} from "./controller/historyController";
import {
  addInventory,
  updateInventory,
  deleteInventory,
} from "./controller/inventoryController";
export default function (app: Express) {
  //user routes
  app.post("/signup",controller.register);
  app.post(
    "/login",
    passport.authenticate("login", { session: false }),
    controller.login
  );
  app.get(
    "/profile",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      return res.send(req?.user);
    }
  );

  //Product Routes
  app.post(
    "/createProduct",
    passport.authenticate("jwt", { session: false }),
    addProduct
  );
  app.get(
    "/getallProducts",
    passport.authenticate("jwt", { session: false }),
    getProducts
  );
  app.patch(
    "/updateProduct",
    passport.authenticate("jwt", { session: false }),
    updateProduct
  );
  app.delete(
    "/deletePro",
    passport.authenticate("jwt", { session: false }),
    deleteProduct
  );
  app.get(
    "/getById",
    passport.authenticate("jwt", { session: false }),
    getProductById
  );
  //Order Routes
  app.post(
    "/addOrder",
    passport.authenticate("jwt", { session: false }),
    addOrderItems
  );
  app.get(
    "/getAllOrders",
    passport.authenticate("jwt", { session: false }),
    getAllOrders
  );
  app.get(
    "/getOrderById",
    passport.authenticate("jwt", { session: false }),
    getOrderById
  );
  app.get(
    "/getMyOrders",
    passport.authenticate("jwt", { session: false }),
    getMyOrders
  );
  //History Routes
  app.post(
    "/addHistory",
    passport.authenticate("jwt", { session: false }), addHistory);
  
  app.patch(
    "/updateHistory",
    passport.authenticate("jwt", { session: false }), updateHistory);
  
  app.delete(
    "/deleteHistory",
    passport.authenticate("jwt", { session: false }), deleteHistory);
  app.get(
    "/getHistory",
  passport.authenticate('jwt',{session:false}),getHistoryById);
  //Inventory Routes
  app.post(
    "/addInventory",
    passport.authenticate("jwt", { session: false }, addInventory)
  );
  app.patch(
    "/updateInventory",
    passport.authenticate("jwt", { session: false }, updateInventory)
  );
  app.delete(
    "/deleteInventory",
    passport.authenticate("jwt", { session: false }, deleteInventory)
  );
}
