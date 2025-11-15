import mongoose from "mongoose";


const transactionschema= new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"user",required:true},
    planId:{type:String,required:true},
    amount:{type:Number,required:true},
    isPaid:{type:String,required:true},
    credits:{type:String,required:true},

})

const transactionModel =
  mongoose.models.transaction || mongoose.model("transaction", transactionschema);

export default  transactionModel;
