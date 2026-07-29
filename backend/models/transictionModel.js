import mongoose from "mongoose";


const transactionschema= new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"user",required:true},
    planId:{type:String,required:true},
    amount:{type:Number,required:true},
    isPaid:{type:Boolean,default:false},
    credits:{type:Number,required:true},
})

const transactionModel =
  mongoose.models.transaction || mongoose.model("transaction", transactionschema);

export default  transactionModel;
