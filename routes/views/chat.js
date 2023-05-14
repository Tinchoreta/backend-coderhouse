import { Router } from "express"
const chatRouter = Router();


chatRouter.get('/chat', async(req,res,next)=> {
    try {
        return res.render('chat',{
            title: 'chat',
            script: 'chat.js'
        });
    } catch(error) {
        next(error);
    }
})