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
        return res.render('index',{
            title: 'index',
            name: name
        });
    } catch(error) {
        next(error);
    }
})

export default viewRouter;