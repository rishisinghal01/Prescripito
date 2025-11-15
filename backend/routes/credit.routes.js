import express from 'express'
import { getPlans, purchasePlans } from '../controllers/credit.controller.js';
import authuser from '../middlewares/authUser.js';

const creditRoute= express.Router();
creditRoute.get('/plan',getPlans)
creditRoute.post('/purchase',authuser,purchasePlans)
export default creditRoute