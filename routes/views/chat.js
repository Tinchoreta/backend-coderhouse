import { Router } from "express"
const chatRouter = Router();


chatRouter.get('/', async(req,res,next)=> {
    try {
        return res.render('chat',{
            title: 'chat',
            script: 'chat.js',
            css: 'chat.css'
        });
    } catch(error) {
        next(error);
    }
})

export default chatRouter;