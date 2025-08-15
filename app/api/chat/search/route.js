import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";



export async function POST(req){

    try{

        const {userId} = getAuth(req)
        if(!userId){
            return NextResponse.json({success:false, message:"User not authenicated"},{status:401})
        }

        const {search} = await req.json()

        //connect to DB and then write search query
        await connectDB()

        if(!search || !search.trim()){
          return NextResponse.json({success:true, searchresults:[]},{status:200})

        }else{

        const results = await Chat.find({
            name:{$regex:search, $options:"i"}
        }).lean()

        return NextResponse.json({success:true, searchresults:results},{status:200})
      }

    }catch(error){
          console.log(error)
          return NextResponse.json({success:false, message:"Internal server Error"},{status:500})
    }

}