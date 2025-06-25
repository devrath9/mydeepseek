import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req){
    
 try{
    const {userId} = getAuth(req)
    if(!userId){
        return NextResponse.json({success:false, message:"User not authenticated"})
    }

    const {chatId, name} = await req.json()

    //connect to database and update chat name
      await connectDB()
      const updatedchatName = await Chat.findOneAndUpdate(
                                     {_id:chatId, userId},
                                      {name},
                                       { new: true, runValidators: true })
       return NextResponse.json({success:true, message:"Chat renamed",updatedchatName})                                

     


    }catch(error){
        return NextResponse.json({success:false, message:error.message})
    }

}