import express from 'express';
import { join } from 'path';
import logger from 'morgan';
import { engine } from 'express-handlebars';

import mainRouter from '../routes/index.js'
import DataBaseStrategy from './persistence/DataBaseStrategy.js';

// import dotenvMiddlewares from './src/middlewares/dotenvMiddleware.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFound.js';
import { cartMiddleware } from './middlewares/cartMiddleware.js';

import Handlebars from './helpers/handlebarsHelper.js';
import __dirname from './utils.js'

import dotenv from 'dotenv';
// const HandlebarsWithHelpers = Handlebars.create(); // Handlebars con helpers

const app = express();


//Para importar las variables de entorno de .env
dotenv.config();

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

//Conectar la base de datos
connect();

//Para hacer una especie de contexto de React para el carrito de compras
app.use(cartMiddleware);

//middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', mainRouter);
app.use('/', express.static(join(__dirname, '../public')));


//template engine
app.engine('handlebars', engine({ handlebars: Handlebars }));

app.set('views', __dirname + '../../views');
app.set('view engine', 'handlebars');

app.use(errorHandler);
app.use(notFoundHandler);

export default app;