import dotenv from 'dotenv';
//Para importar las variables de entorno de .env
dotenv.config();

import express from 'express';
import { join } from 'path';
import logger from 'morgan';
import { engine } from 'express-handlebars';

import mainRouter from '../routes/index.js'
import DataBaseStrategy from './persistence/DataBaseStrategy.js';

import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFound.js';
import { cartMiddleware } from './middlewares/cartMiddleware.js';

import Handlebars from './helpers/handlebarsHelper.js';
import __dirname from './utils.js'



// import { faker } from '@faker-js/faker';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import mongoStore from 'connect-mongo';
import passport from 'passport';
import inicializePassport from './config/passportConfig.js';

import flash from 'connect-flash';

// import Address from './models/address.model.js';
// import Customer from './models/customer.model.js';


// Obtén los valores de las variables de entorno
const {
    GH_APP_ID,
    GH_CLIENT_ID,
    GH_CLIENT_SECRET,
    GH_CALLBACK,
    // Agrega aquí las demás variables de entorno que necesites
} = process.env;

// Imprime los valores de las variables de entorno en la consola
console.log('GH_APP_ID:', GH_APP_ID);
console.log('GH_CLIENT_ID:', GH_CLIENT_ID);
console.log('GH_CLIENT_SECRET:', GH_CLIENT_SECRET);
console.log('GH_CALLBACK:', GH_CALLBACK);

const app = express();

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

//Sesion y cookies
app.use(cookieParser(process.env.SECRET_COOKIE));
app.use(expressSession(
    {
        secret: process.env.SECRET_SESSION,
        resave: true,
        saveUninitialized: true,
        store: mongoStore.create({
            mongoUrl: process.env.MONGO_DB_URI,
            ttl: 1000000
        })
    }
));

//Passport 

inicializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// // Middleware de prueba
// app.use((req, res, next) => {
//     console.log("Middleware de prueba después de la sesión.");
//     next();
// });

// populateCustomers();

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

// async function populateCustomers(){
//     // Crear e insertar 10 clientes con direcciones
//     for (let i = 0; i < 10; i++) {
//         // Crear una dirección
//         const address = new Address({
//             firstName: faker.person.firstName(),
//             lastName: faker.person.lastName(),
//             company: faker.company.name(),
//             addressLine1: faker.location.streetAddress(),
//             addressLine2: faker.location.secondaryAddress(),
//             city: faker.location.city(),
//             state: faker.location.state(),
//             postalCode: faker.location.zipCode(),
//             country: faker.location.country(),
//             additionalInfo: faker.lorem.sentence(),
//             phone: faker.phone.number(),
//             mobilePhone: faker.phone.number(),
//         });

//         // Guardar la dirección en la base de datos
//         await address.save();

//         // Crear un cliente
//         const customer = new Customer({
//             title: faker.person.prefix(),
//             firstName: faker.person.firstName(),
//             lastName: faker.person.lastName(),
//             email: faker.internet.email(),
//             password: faker.internet.password(),
//             dateOfBirth: faker.date.past(),
//             addresses: [address._id], // Asignar la dirección como la dirección principal del cliente
//         });

//         // Guardar el cliente en la base de datos
//         await customer.save();

//         console.log(`Cliente ${i + 1} y dirección insertados`);
//     }
//     const address = new Address({
//         firstName: faker.person.firstName(),
//         lastName: faker.person.lastName(),
//         company: faker.company.name(),
//         addressLine1: faker.location.streetAddress(),
//         addressLine2: faker.location.secondaryAddress(),
//         city: faker.location.city(),
//         state: faker.location.state(),
//         postalCode: faker.location.zipCode(),
//         country: faker.location.country(),
//         additionalInfo: faker.lorem.sentence(),
//         phone: faker.phone.number(),
//         mobilePhone: faker.phone.number(),
//     });

//     // Guardar la dirección en la base de datos
//     await address.save();

//     // Crear un cliente
//     const customer = new Customer({
//         title: faker.person.prefix(),
//         firstName: faker.person.firstName(),
//         lastName: faker.person.lastName(),
//         email: 'tinchoreta@gmail.com',
//         password: 'Cocohueso23',
//         dateOfBirth: faker.date.past(),
//         addresses: [address._id], // Asignar la dirección como la dirección principal del cliente
//     });

//     // Guardar el cliente en la base de datos
//     await customer.save();
// } 

