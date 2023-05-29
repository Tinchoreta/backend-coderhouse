import express from 'express';
import { join } from 'path';
import logger from 'morgan';
import mainRouter from './routes/index.js'
import DataBaseStrategy from './src/Data/DataBaseStrategy.js';
import dotenv from 'dotenv';
import { engine } from 'express-handlebars';
import Handlebars from './helpers/handlebarsHelper.js';
import __dirname from './utils.js'
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFound.js';

const HandlebarsWithHelpers = Handlebars.create(); // Handlebars con helpers

dotenv.config();

const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', mainRouter);
app.use('/', express.static(join(__dirname, 'public')));
app.use(logger('dev'));

//template engine
app.engine('handlebars', engine({ handlebars: HandlebarsWithHelpers }));
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use(errorHandler);
app.use(notFoundHandler);

let URI = process.env.MONGO_DB_URI;

let dataBaseStrategy = new DataBaseStrategy(URI);

async function connect() {
    try {
        await dataBaseStrategy.connect();
        console.log('Database Connected');
    } catch (error) {
        console.log(error);
    }
}

connect();

export default app;


/* import express from 'express';

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

//let URI = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.xgzbctr.mongodb.net/coder-backend`;

let URI = process.env.MONGO_DB_URI;

//console.log(URI);

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


export default app; */