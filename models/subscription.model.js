import mongoose from 'mongoose';

const subscriptionSchema = mongoose.Schema({

    name: {
        type:String,
        required:[true,"Subscription  name is required"],
        trim: true,
        minLength:2,
        maxLength:100,
    },
    price: {
        type:String,
        required:[true,"Subscription  name is required"],
        trim: true,
        min:[0,"price must be greater then 0"],
        max:[1000,"Price must be less then 1000"],
    },
    
    currency: {
        type: String,
        enum: {
          values: ['USD', 'EUR', 'INR', 'GBP', 'JPY', 'AUD', 'CAD'],
          message: '{VALUE} is not a supported currency'
        },
        required: [true, "Currency is required"],
        default: 'USD'
      },

    
    frequency:{
        type:String,
        enum:['daily','weekly','monthly','yearly']

    },

    category:{
        type:String,
        enum: [
          'sports',
          'entertainment',
          'education',
          'productivity',
          'news',
          'technology',
          'music',
          'gaming',
          'health',
          'fitness',
          'finance',
          'shopping',
          'travel',
          'food',
          'books',
          'streaming',
          'software',
          'cloud services',
          'others'
        ],
        required: true,

    },

    paymentMethod: {
        type: String,
        // enum: {
        //   values: ['credit_card', 'debit_card', 'paypal', 'upi', 'net_banking', 'cash'],
        //   message: '{VALUE} is not a valid payment method'
        // },
        required: [true, 'Payment method is required'],
        trim: true,
      },
      
      status: {
        type: String,
        enum: {
          values: ['active', 'inactive', 'pending', 'cancelled'],
          message: '{VALUE} is not a valid status'
        },
        default: 'active'
      },
      
      startDate: {
        type: Date,
        required: true,
        validate: {
          validator: function(value) {
            return value <= new Date();
          },
          message: "Start date must be in the past"
        }
      },
      
      renewalDate: {
        type: Date,
        validate: {
          validator: function(value) {
            return !this.startDate || value > this.startDate;
          },
          message: "Renewal date must be after the start date"
        }
      },
      user:{
        type: mongoose.Schema.ObjectId,
        ref:'User',
        required: true,
        index: true,
      },




},{Timestamp: true});

// autocalculate renewal date :

subscriptionSchema.pre('save',function(next){
    if(!this.renewalDate){
        const renewalPeriods ={
            daily:1,
            weekly:7,
            monthly:30,
            yearly:365,
        };

        this.renewalDate=new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate()+renewalPeriods[this.frequency]);

    }
    if(this.renewalDate < new Date()){
        this.status= 'expired';
    }

    next();
});




const Subscription = mongoose.model('Subscription',subscriptionSchema);

export default Subscription;