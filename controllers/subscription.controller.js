import { SERVER_URL } from "../config/env.js";
import { workflowClient } from "../config/uptash.js";
import Subscription from "../models/subscription.model.js"


export const createSubscription = async(req,res,next)=>{
  try{
      const subscription = await  Subscription.create({
        ...req.body,
        user: req.user._id,
      });
      console.log("Using SERVER_URL:", SERVER_URL);

      await workflowClient.trigger({
      

        url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
        
        body:{
          subscriptionId: subscription.id,

        },
        headers: {
          'content-type' : 'application/json',
        },
        retries:0,

      })
      res.redirect('/dashboard');
    //res.status(201).json({ success: true, data: subscription });
  }
  catch(error){
    console.error("Error creating subscription:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

export const getUsersubscriptions = async (req,res,next)=>{
  try{
    if (req.user.id !== req.params.id){
        const error = new Error("You are not the owner of the account");
        error.status = 401;
        throw error;
      }
      const subscriptions = await Subscription.find({user:req.params.id});

      res.status(200).json({success:true,data: subscriptions});
  }
  catch(error){
next(error);
  }
}

export const deleteSubscription = async (req, res, next) => {
  try {
    const sub = await Subscription.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!sub) {
      return res.status(404).send("Subscription not found or unauthorized");
    }

    res.redirect('/dashboard');
  } catch (error) {
    console.error("Error deleting subscription:", error);
    res.status(500).send("Error deleting subscription");
  }
};
