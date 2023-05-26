import express from 'express';
import __dirname from './utils.js'
import mainRouter from './routes/index.js'
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFound.js';
import { engine } from 'express-handlebars';
import { join } from 'path';
import logger from "morgan";
import DataBaseStrategy from './src/Data/DataBaseStrategy.js';
import dotenv from 'dotenv';


dotenv.config();

const app = express()

//middlewares   

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/', mainRouter);
app.use('/', express.static(join(__dirname, 'public')));
app.use(logger("dev"));

//template engine
app.engine('handlebars', engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use(errorHandler)
app.use(notFoundHandler)

let URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xgzbctr.mongodb.net/coder-backend`;

let dataBaseStrategy = new DataBaseStrategy(URI);

async function connect() {
    try {
        await dataBaseStrategy.connect();
        console.log("Database Connected");
    } catch (error) {
        console.log(error);
    }
}

connect();


export default app;