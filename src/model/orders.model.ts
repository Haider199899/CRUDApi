import mongoose,{Schema,model,Document} from 'mongoose';
 interface IOrderItems extends Document {
    name: string;
    qty: number;
    image: string;
    price: number;
    product: string;
  }
  
  interface IShippingAddress extends Document {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  }
  
   interface IPaymentResult extends Document {
    id: any;
    status: any;
    update_time: any;
    email_address: any;
  }
  
   interface IOrder extends Document {
    user: string;
    orderItems: IOrderItems[];
    shippingAddress: IShippingAddress;
    paymentMethod: string;
    paymentResult: IPaymentResult | any;
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
          image: { type: String, required: true },
          price: { type: Number, required: true },
          product: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Product',
          },
        },
      ],
      shippingAddress: {
        address: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        postalCode: {
          type: String,
          required: true,
        },
        country: {
          type: String,
          required: true,
        },
      },
      paymentMethod: {
        type: String,
        required: true,
      },
      paymentResult: {
        id: { type: String },
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String },
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
  
  const Order = model('Order', orderSchema);
  export default Order;
  export {IOrder,IOrderItems,IShippingAddress,IPaymentResult};