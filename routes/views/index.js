import { Router } from "express"
const viewRouter = Router();


// viewRouter.get('/chat', async(req,res,next)=> {
//     try {
//         return res.render('chat',{
//             title: 'chat',
//             script: 'chat.js'
//         });
//     } catch(error) {
//         next(error);
//     }
// })


viewRouter.get('/', async(req,res,next)=> {
    try {

        let name = "Tincho"
        let itemsOnCart = 10;
        let totalPrice = 150;

        return res.render('index',{
            title: 'BootShop',
            user: name,
            itemsOnCart1: itemsOnCart,
            totalPrice: totalPrice
        });
    } catch(error) {
        next(error);
    }
})

export default viewRouter;