import express from 'express';
import __dirname from './utils.js'
import mainRouter from './routes/index.js'
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFound.js';
import { engine } from 'express-handlebars';
import {join} from 'path';
import logger from "morgan";
import DBStrategy from './src/Data/DBStrategy.js';


const app = express()


//middlewares   

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/', mainRouter);
app.use('/',express.static(join(__dirname, 'public')));
app.use(logger("dev"));

//template engine
app.engine('handlebars', engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')


app.use(errorHandler)
app.use(notFoundHandler)

let URI = 'mongodb+srv://tinchoreta:21362428@cluster0.xgzbctr.mongodb.net/coder-backend';

let dbStrategy = new DBStrategy(URI);

async function connect() {
    try {
        await dbStrategy.connect();
        console.log("Database Connected");
    } catch (error) {
        console.log(error);
    }
}

connect();


export default app;