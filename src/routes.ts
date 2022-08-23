import {Express,Request,Response} from 'express';
import controller from './controller/user.controller';
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

export default function (app:Express){
    
    
    
    //Register User
    app.post('/register', controller.register);
    //User login
    app.post('/login', controller.login);
    //get allusers details
    app.get('/get/all', passport.authenticate("local"), controller.getAllUsers);
    app.get('api/demo',(req,res)=>{
        res.json({sessionId:req.sessionID});
      });
//Routes for orders
/*
    app.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
    app.route('/myorders').get(protect, getMyOrders);
    app.route('/:id').get(protect, getOrderById);
    app.route('/:id/pay').put(protect, updateOrderToPaid);
    app.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);*/

}
