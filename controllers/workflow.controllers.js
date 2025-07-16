import {createRequire} from "module";
import dayjs from 'dayjs'
const require = createRequire(import.meta.url);
const {serve} = require('@upstash/workflow/express');

import  Subscription from '../models/subscription.model.js';
import { sendReminderEmail } from "../utils/send-email.js";


const REMINDERS = [7,5,2,1];

export const sendReminders = serve(async(context)=>{
  console.log("✅ Workflow triggered!");
 const {subscriptionId} = context.requestPayload;
 console.log("Subscription ID received:", subscriptionId);
 const subscription = await fetchSubscription(context,subscriptionId);
 console.log("Fetched subscription:", subscription);

 if (!subscription || subscription.status !== 'active') return;

const renewalDate = dayjs(subscription.renewalDate);
if(renewalDate.isBefore(dayjs())){
  console.log(`Renewal date has passed for subscription ${subscriptionId}.  Stopping workflow`);
  return;
}
for (const daysBefore of REMINDERS){
  const reminderDate = renewalDate.subtract(daysBefore,'day');
  if (reminderDate.isAfter(dayjs())) {
    await sleepUntilReminder(context , `${daysBefore} days before reminder`, reminderDate);
    await triggerReminder(context, `${daysBefore} days before reminder`, subscription);
    return;
  } else {
    console.log(`❌ Skipping past reminder: ${daysBefore} days before. (${reminderDate.format()})`);
  }
  
}


});


const fetchSubscription = async (context,subscriptionId)=>{
  return await context.run('get subscription',async()=>{
    return Subscription.findById(subscriptionId).populate('user','name email'); //schema is used here
  })
}



const sleepUntilReminder = async (context, label, date) => {
  console.log(`Sleeping until ${label} at ${date}`);
  await context.sleepUntil(label, date.toDate());
};

const triggerReminder = async (context, label, subscription) => {
  return await context.run(label, async () => {
    console.log(`Triggering ${label} reminder`);
    await sendReminderEmail({
      to: subscription.user.email,
      type: label,
      subscription: subscription, // ✅ this was missing
    });
  });
};
