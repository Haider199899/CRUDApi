import { application, Express, Request, Response } from "express";
import controller from "./controller/user.controller";
import { celebrate, Joi, Segments } from "celebrate";

import {
  addProduct,
  deleteProduct,
  getProductById,
  getProducts,
  get_Pro_Info,
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
  get_user_order,
} from "./controller/orderController";
import passport from "passport";
//import { addInventory } from './controller/inventoryController';
import "./middleware/passportMiddleware";
import {
  addHistory,
  updateHistory,
  deleteHistory,
  getHistoryById,
  getHisByDate,
  getHisByMonth,
} from "./controller/historyController";
import {
  addInventory,
  updateInventory,
  deleteInventory,
} from "./controller/inventoryController";
export default function (app: Express) {
  //user routes
  app.post(
    "/reg",
    passport.authenticate("jwt", { session: false }),
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        name: Joi.string().alphanum().min(2).max(30).required(),
        email: Joi.string().required().email(),
        password: Joi.string()
          .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
          .required()
          .min(8),
        isAdmin: Joi.boolean().required(),
      }),
    }),
    controller.register);
  //Signup with integration of Redis
  app.post(
    "/SignUp",
    passport.authenticate("jwt", { session: false }),
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        name: Joi.string().alphanum().min(2).max(30).required(),
        email: Joi.string().email(),
        key: Joi.string().required(),
      }),
    }),
    controller.SignUp
  );
  //Login with redis
  app.get('/logRedis', celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().alphanum().min(2).max(30).required(),
      email: Joi.string().required().email(),
    }),
  }),
  controller.LogIn);

  app.post(
    "/login",
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string()
          .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
          .required()
          .min(8),
      }),
    }),
    function (req, res) {
      passport.authenticate("local", function (err, user, info) {
        if (err) {
          res.status(404).json({
            message: "Invalid credentials" + err,
            success: false,
          });
          return;
        }

        if (user) {
          const token = jwt.sign(user.toJSON(), "superencryptedsecret", {
            expiresIn: "365d",
          });
          res.status(200);
          res.json({
            userInfo: user,
            token: token,
          });
        } else {
          res.status(401).json({
            message: "Unauthorized",
          });
        }
      })(req, res);
    }
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
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        product_name: Joi.string().required(),
        brand: Joi.string().required(),
        category: Joi.string().required(),
        price: Joi.number().required(),
        countInStock: Joi.number().required(),
        outofStock: Joi.boolean().required(),
      }),
    }),
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
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        id: Joi.string().hex().length(24).required(),
        product_name: Joi.string(),
        brand: Joi.string(),
        category: Joi.string(),
        price: Joi.number(),
        countInStock: Joi.number(),
      }),
    }),
    passport.authenticate("jwt", { session: false }),
    updateProduct
  );
  app.delete(
    "/deletePro",
    celebrate({
      [Segments.BODY]: Joi.object({
        id: Joi.string().hex().length(24),
      }),
    }),
    passport.authenticate("jwt", { session: false }),
    deleteProduct
  );
  app.get(
    "/getById",
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        id: Joi.string().hex().length(24),
      }),
    }),
    passport.authenticate("jwt", { session: false }),
    getProductById
  );
  app.get(
    "/getProInfo",
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        product_id: Joi.string().hex().length(24),
      }),
    }),
    passport.authenticate("jwt", { session: false }),
    get_Pro_Info
  );
  //Order Routes
  app.post(
    "/addOrder",
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        user: Joi.string()
          .hex()
          .length(24)
          .required()
          .messages({ user: "user error" }),
        orderItems: Joi.array()
          .items(
            Joi.object({
              name: Joi.string().required().messages({ name: "name error" }),
              qty: Joi.number().required().messages({ qty: "qty error" }),
              price: Joi.number().required().messages({ price: "price error" }),
              product_id: Joi.string()
                .hex()
                .length(24)
                .messages({ id: "id error" }),
            })
          )
          .required(),
        shippingAddress: Joi.string().required(),
        paymentMethod: Joi.string().required(),
        taxPrice: Joi.number().required(),
        shippingPrice: Joi.number().required(),
        totalPrice: Joi.number().required(),
        isPaid: Joi.boolean().required(),
        paidAt: Joi.date().required(),
        isDelievered: Joi.boolean().required(),
        delieveredAt: Joi.date().required(),
      }),
    }),
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
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        id: Joi.string().hex().length(24).required(),
      }),
    }),
    passport.authenticate("jwt", { session: false }),
    getOrderById
  );
  app.get(
    "/getMyOrders",
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        user: Joi.string().hex().length(24).required(),
      }),
    }),
    passport.authenticate("jwt", { session: false }),
    getMyOrders
  );
  app.get(
    "/getOrderOfuser",
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        user_id: Joi.string().hex().length(24).required(),
      }),
    }),
    passport.authenticate("jwt", { session: false }),
    get_user_order
  );

  //History Routes
  app.post(
    "/addHistory",
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        product_name: Joi.string().required(),
        currentPrice: Joi.number().required(),
        previousPrice: Joi.number().required(),
        countInStock: Joi.number().required(),
        outofStock: Joi.boolean().required(),
        product_id: Joi.string().hex().length(24).required(),
      }),
    }),
    passport.authenticate("jwt", { session: false }),
    addHistory
  );

  app.patch(
    "/updateHistory",
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        product_name: Joi.string().required(),
        currentPrice: Joi.number().required(),
        previousPrice: Joi.number().required(),
        countInStock: Joi.number().required(),
        outofStock: Joi.boolean().required(),
        product_id: Joi.string().hex().length(24).required(),
      }),
    }),
    passport.authenticate("jwt", { session: false }),
    updateHistory
  );

  app.delete(
    "/deleteHistory",
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        id: Joi.string().hex().length(24).required(),
      }),
    }),
    passport.authenticate("jwt", { session: false }),
    deleteHistory
  );
  app.get(
    "/getHistory",
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        id: Joi.string().hex().length(24).required(),
      }),
    }),
    app.get(
      "/getHistoryByDate",
      celebrate({
        [Segments.BODY]: Joi.object().keys({
          product_id: Joi.string().hex().length(24).required(),
        }),
      }),
      passport.authenticate("jwt", { session: false }),
      getHisByDate
    )
  );

  app.get(
    "/getHistoryByMonth",
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        product_id: Joi.string().hex().length(24).required(),
      }),
    }),
    passport.authenticate("jwt", { session: false }),
    getHisByMonth
  );
  //Inventory Routess
  app.post(
    "/addInventory",
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        price: Joi.number().required(),
        countInStock: Joi.number().required(),
        product_id: Joi.string().hex().length(24).required(),
      }),
    }),

    passport.authenticate("jwt", { session: false }, addInventory)
  );
  app.patch(
    "/updateInventory",
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        price: Joi.number().required(),
        countInStock: Joi.number().required(),
        product_id: Joi.string().hex().length(24).required(),
      }),
    }),
    passport.authenticate("jwt", { session: false }, updateInventory)
  );
  app.delete(
    "/deleteInventory",
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        id: Joi.string().hex().length(24).required(),
      }),
    }),
    passport.authenticate("jwt", { session: false }, deleteInventory)
  );
}
