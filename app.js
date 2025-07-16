import express from 'express';
import {PORT} from './config/env.js'
import subRouter from "./routes/subscription.routes.js";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import connectToDatabase from './database/mongodb.js';
import viewRouter from "./routes/view.routes.js";
import errorMiddleware from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';
import arcjetMiddleware from './middlewares/arcjet.middleware.js';
import workflowRouter from './routes/workflow.route.js';
const app = express();
import path from "path";
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';

app.use(methodOverride('_method'));

app.set("view engine",'ejs');
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use("/", viewRouter);
app.use(errorMiddleware);
app.use(arcjetMiddleware);

app.get("/",(req,res)=>{
 res.render("auth");
});


app.use('/api/v1/auth',authRouter);  
app.use('/api/v1/users',userRouter);
app.use('/api/v1/subscriptions',subRouter);
app.use('/api/v1/workflows',workflowRouter);




app.listen(PORT,async()=>{
  console.log(`Server at http://localhost:${PORT}`);
 await connectToDatabase();
});

