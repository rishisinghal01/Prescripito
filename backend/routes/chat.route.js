import express from 'express'
import { createchat, deletechat, getchat } from '../controllers/chatController.js';
import authuser from '../middlewares/authUser.js';

const chatRoute= express.Router();


chatRoute.get('/create',authuser,createchat)
chatRoute.get('/get',authuser,getchat)
chatRoute.post('/delete',authuser,deletechat)


export default chatRoute



