import mongoose,{Schema,model,Document} from 'mongoose';
 interface IOrderItems extends Document {
    name: string;
    qty: number;
    price: number;
    product: string;
  }
  
 
   interface IOrder extends Document {
    user: string;
    orderItems: IOrderItems[];
    shippingAddress:string;
    paymentMethod: string;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
    isPaid: boolean;
    paidAt: any;
    isDelivered: boolean;
    deliveredAt: any;
  }
  const orderSchema: Schema = new Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },
      orderItems: [
        {
          name: { type: String, required: true },
          qty: { type: Number, required: true },
         
          price: { type: Number, required: true },
          product: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Product',
          },
        },
      ],
      shippingAddress: {
       type:String,
       required:true
      },
      paymentMethod: {
        type: String,
        required: true,
      },
    
      taxPrice: {
        type: Number,
        required: true,
        default: 0.0,
      },
      shippingPrice: {
        type: Number,
        required: true,
        default: 0.0,
      },
      totalPrice: {
        type: Number,
        required: true,
        default: 0.0,
      },
      isPaid: {
        type: Boolean,
       required: true,
        default: false,
      },
      paidAt: {
        type: Date,
      },
      isDelivered: {
        type: Boolean,
        required: true,
        default: false,
      },
      deliveredAt: {
        type: Date,
      },
    },
    {
      timestamps: true,
    }
  );
  orderSchema.set("toJSON", {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  });
  
  
  const Order = model('Order', orderSchema);
  export default Order;
  export {IOrder,IOrderItems};