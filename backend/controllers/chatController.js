import chatModel from "../models/chatModel.js";
import userModel from "../models/userModel.js";

const createchat = async(req,res)=>{
     try{
        const userId=req.userId ;
        const user= await userModel.findById(userId)
        const chatData={
            userId,
            messages:[],
            name:"New Chat",
            username: user.name
        }
        await chatModel.create(chatData)
        res.json({success:true,message:"Chat created"})

        
     }
     catch(err){
        res.json({success:false,err:err.message})
     }
}
const getchat= async(req,res)=>{
    try{
    const userId=req.userId;
   const chats= await chatModel.find({userId}).sort({updatedAt:-1})




    res.json({success:true,chats})
    }
    catch(err){
        res.json({success:false,err:err.message})

    }
}


const deletechat= async(req,res)=>{
    try{
    const userId=req.userId;
    const {chatId}= req.body;
    await chatModel.deleteOne({_id:chatId,userId})
    res.json({success:true,message:"Deleted"})
    }
    catch(err){
        res.json({success:false,err:err.message})
    }
}




export {createchat,getchat,deletechat}


