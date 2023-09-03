import express from 'express';
import { join } from 'path';
import logger from 'morgan';
import { engine } from 'express-handlebars';

import mainRouter from './routes/index.js'
import DataBaseStrategy from './persistence/DataBaseStrategy.js';

import {errorHandlerMiddleware} from './services/errors/errorHandler.js';
import notFoundHandler from './middlewares/utils/notFound.js';
import { cartMiddleware } from './middlewares/business/cartMiddleware.js';

import Handlebars from './helpers/handlebarsHelper.js';
import __dirname from './utils.js'

import passport from 'passport';
import inicializePassport from './config/passportConfig.js';

import { config } from './config/config.js';

import winstonLogger from './config/logger.js';
import cors from 'cors';

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';


const app = express();

//Uso de logging de Winston

app.use(winstonLogger);

let URI = config.MONGO_DB_URI;

let dataBaseStrategy = new DataBaseStrategy(URI);

async function connect() {
    try {
        await dataBaseStrategy.connect();
        console.log('Database Connected');
    } catch (error) {
        console.log(error);
    }
}

// app.use(cors);

//Conectar la base de datos
connect();

const swaggerOptions = {
    definition: {
        openapi: "3.0.1", // Specification (optional, defaults to OpenAPI 2.0),
        info: {
            title: "API REST - Shopping Cart - Bootshop",
            description: 'Shopping Cart API',
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}

console.log(`${__dirname}/docs/**/*.yaml`);

const swaggerDocs = swaggerJSDoc({ ...swaggerOptions });
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerDocs))


//Para hacer una especie de contexto de React para el carrito de compras
app.use(cartMiddleware);

//Passport 

inicializePassport();
app.use(passport.initialize());


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

app.use(errorHandlerMiddleware);
app.use(notFoundHandler);

export default app;

