import express from 'express'
import authuser from '../middlewares/authUser.js';
import { imagemessageControlller, textMessageController } from '../controllers/message.controller.js';

const messageRouter= express.Router();

messageRouter.post('/text',authuser,textMessageController)
messageRouter.post('/image',authuser,imagemessageControlller)
export default messageRouter