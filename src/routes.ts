import {Express,Request,Response} from 'express';
import controller from './controller/user.controller';
import { addProduct,deleteProduct,getProductById,getProducts, updateProduct } from './controller/productController';
import validate from './middleware/validateRequest';
import User from './model/user.model';

import {
    addOrderItems,
    getMyOrders,
    getOrderById,
    getOrders,
    updateOrderToDelivered,
    updateOrderToPaid,
  } from './controller/orderController';
import passport from 'passport';
import { auth } from './middleware/authMidleware';
import { addInventory } from './controller/inventoryController';
export default function (app:Express){
    
    
    
    //Register User
    app.post('/register',controller.register);
    //User login
    //app.post('/login', controller.login);
    app.post('/login', controller.login);
    app.get(
      "/profile",
      passport.authenticate("local", { session: false }),
      (req, res) => {
        return res.json(User)
      });

/*
    return res.status(201).json( {name:req.body.name,
        email:req.body.email,
        password:req.body.password});
      }
    );*/
    //Product Routes
    app.post('/createProduct',addProduct);
    app.get('/getallProducts',getProducts);
    app.patch('/updateProduct',updateProduct);
    app.delete('/deletePro',deleteProduct);
    app.get('/getById',getProductById);
    //Inventory routes
    app.post('/addInve',addInventory);
    app.post('/addOrder',addOrderItems);
    /*(req, res, next) 
    => {
      passport.authenticate('local', (err, user, info) => {
        if (err) {
          console.log("hi");
          return next(err);
        }
    
        if (!user) {
          return res.json({
            message:"Incorrect username or password"
          })
        }
    
        req.logIn(user, function(err) {
          if (err) {
            return next(err);
          }
         return res.json({
            message:"Valid user!"
          });
        });
      })(req, res, next);
    });*/
    //get allusers details
    app.get('/get/all', passport.authenticate("local"), controller.getAllUsers);
  
//Routes for orders
/*
    app.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
    app.route('/myorders').get(protect, getMyOrders);
    app.route('/:id').get(protect, getOrderById);
    app.route('/:id/pay').put(protect, updateOrderToPaid);
    app.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);*/

}
