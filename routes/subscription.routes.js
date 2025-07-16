import {Router} from "express";
import authorize from "../middlewares/auth.middleware.js"
import { createSubscription, deleteSubscription, getUsersubscriptions } from "../controllers/subscription.controller.js";
const subRouter = Router();


subRouter.post("/",authorize,createSubscription)



subRouter.delete("/:id",authorize,deleteSubscription);


subRouter.get("/user/:id",authorize,getUsersubscriptions);


export default subRouter;