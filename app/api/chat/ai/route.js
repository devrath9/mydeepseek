export const maxDuration = 100;

import OpenAI from "openai";
import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

//initialise openai client with deepseek api key and base url
// const openai = new OpenAI({
//         baseURL: 'https://api.deepseek.com',
//         apiKey: process.env.DEEPSEEK_API_KEY
// });

// export async function POST(req){
// try{

// const {userId} = getAuth(req)
// const {chatId, prompt}= await req.json()

//  if(!userId){
//         return NextResponse.json({success:false, message:"User not authenticated"})
//     }

// //connect to database and find chat
//  await connectDB()
//  const data = await Chat.findOne({_id:chatId, userId})  
//  if (!data) {
//       return NextResponse.json({ success: false, message: "Chat not found" });
//     }

//  //create a user message object
//  const userPrompt = {
//     role:"user",
//     content:prompt,
//     timestamp:Date.now()
//  }

//   data.messages.push(userPrompt)

//  const completion = await openai.chat.completions.create({
//     messages: [{ role: "user", content: prompt }],
//     model: "deepseek-chat",
//     store:true
//   });

//   const deepresponse={
//     ...completion.choices[0].message,
//     timestamp:Date.now()
//   }

//    data.messages.push(deepresponse)
//    await data.save()

//    return NextResponse.json({success:true, data:deepresponse})





// }catch(error){
//     return NextResponse.json({success:false, message:error.message})
// }
// }
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.DEEPSEEK_API_KEY
});

export async function POST(req) {
  
  try {
    const { userId } = getAuth(req);
    const { chatId, prompt } = await req.json();

    if (!userId) {
      return NextResponse.json({ message: "User not authenticated" },{ status: 401},);
    }

    await connectDB();
    const data = await Chat.findOne({ _id: chatId, userId });
    if (!data) {
      return NextResponse.json({ message: "Chat not found" },{ status:401},);
    }

    // Create user message
    const userPrompt = {
      role: "user",
      content: prompt,
      timestamp: Date.now()
    };
    data.messages.push(userPrompt);

    // Prepare messages array (only role and content) excluding timestamps
    const apiMessages = data.messages.map(({ role, content }) => ({
      role,
      content
    }));

   

    // Get completion from DeepSeek
    const stream = await openai.chat.completions.create({
      messages: apiMessages,  // Send full conversation history
      model: "deepseek/deepseek-r1-0528:free", // Updated model name
      stream:true
    });

    //Now chunks from LLM response have to be sent one by one
      const encoder = new TextEncoder()

      let fullResponse = '';
      const readableStream = new ReadableStream({
        async start(controller){
           for await (const chunk of stream){
             const content = chunk?.choices[0]?.delta?.content

             if(content){
                fullResponse += content; // Collect for saving
               controller.enqueue(encoder.encode(content))
             }
           }
           controller.close()

           const assistantFullResponse = {
            role:"assistant",
            content:fullResponse,
            timestamp:Date.now()
           }

           data.messages.push(assistantFullResponse)
           await data.save()
        }
      })


      //Returning the stream response

      return new Response(readableStream,{
        status:200,
          headers: {
      "Content-Type": "text/plain",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
    }
      })

   
    // const deepseekResponse = {
    //   ...completion.choices[0].message,
    //   timestamp: Date.now()
    // };

    // data.messages.push(deepseekResponse);
    // await data.save();

    // return NextResponse.json({ success: true, data: deepseekResponse });

  } catch (error) {
    return NextResponse.json(
     
      {message: error.message ||"Internal Server Error"},
      { status:500}, );
  }
}