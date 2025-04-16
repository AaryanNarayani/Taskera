require('dotenv').config();
import express from 'express';
import cors from "cors";
import session from 'express-session';
import { authRouter } from './routers/authRouter';
import passport from 'passport';
import { getPrisma } from './utils/getPrisma';
import './middlewares/oauthMiddleware'
import { taskRouter } from './routers/taskRouter';
import { calendarRouter } from './routers/calendarRouter';
import { generalRouter } from './routers/generalRouter';
const app = express();
const port = 3000;
const JWT_SECRET = process.env.JWT_SECRET;
app.use(express.json());
app.use(cors());

app.use(session({
    secret: JWT_SECRET as string, 
    resave: false,
    saveUninitialized: true,
}));

app.use('/api/v1/auth',authRouter);
app.use('/api/v1/tasks',taskRouter);
app.use('/api/v1/calendar',calendarRouter);
app.use('/api/v1/general',generalRouter);

app.get('/',(req,res)=>{
    res.send("API Setup")
});

app.use(passport.initialize());
app.use(passport.session());

(async function database(){
    try{
    await getPrisma();
    console.log("Database connected securely");
    }catch(e){
        console.log("Failed to establish connection to database", e);
    }

})()

app.listen(port,()=>{
    console.log(`Server running on Port: ${port}`)
})

