import express from 'express'
import authuser from '../middlewares/authUser.js';
import { analyzeImageController, textMessageController } from '../controllers/message.controller.js';

const messageRouter= express.Router();

messageRouter.post('/text',authuser,textMessageController)
messageRouter.post('/analyze',authuser,analyzeImageController)
export default messageRouter