import express from 'express';
import __dirname from './utils.js'
import mainRoutes from './routes/index.js'
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFound.js';
import { engine } from 'express-handlebars';


const app = express()

//template engine
app.engine('handlebars',engine())
app.set('views',__dirname+'/views')
app.set('view engine','handlebars')

//middlewares   
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname + '/public'));
app.use('/', mainRoutes);

app.use(errorHandler)
app.use(notFoundHandler)



export default app;