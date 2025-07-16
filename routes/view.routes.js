import { Router } from "express";
import Subscription from "../models/subscription.model.js";
import authorize from "../middlewares/auth.middleware.js";
import dayjs from 'dayjs';


const router = Router();

router.get('/dashboard', authorize, async (req, res) => {
  const subscriptions = await Subscription.find({ user: req.user._id });

  const reminders = subscriptions.map((sub) => {
    const now = dayjs();
    const renewal = dayjs(sub.renewalDate);

    const daysLeft = renewal.diff(now, 'day');
    let upcoming = null;

    if ([7, 5, 2, 1].includes(daysLeft)) {
      upcoming = `You will receive a reminder in ${daysLeft} day${daysLeft > 1 ? 's' : ''}`;
    }

    return {
      _id: sub._id,
      name: sub.name,
      renewal: renewal.format('YYYY-MM-DD'),
      frequency: sub.frequency,
      upcoming,
    };
  });

  res.render('dashboard', { reminders });
});

export default router;