import { Router } from "express"
const viewRouter = Router();


viewRouter.get('/', async(req,res,next)=> {
    try {
        return res.render('chat',{
            title: 'chat',
            script: 'chat.js'
        });
    } catch(error) {
        next(error);
    }
})


export default viewRouter;