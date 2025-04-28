"use client"

import Image from "next/image";
import { assets } from "@/assets/assets";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import PromptBox from "@/components/PromptBox";
import Message from "@/components/Message";

export default function Home() {
  
  const[expand, setExpand] = useState(false)
  const[loading, setLoading] = useState(false)
  const[messages, setMessages] = useState([])

  return (
    <div className="flex h-screen" >
     <Sidebar expand={expand} setExpand={setExpand}/>
      <div className="flex-1 flex flex-col justify-center items-center px-4 pb-8  bg-[#292a2d] text-white relative">
        <div className={`md:hidden absolute flex justify-between  items-center w-full top-6 px-4 `}>
          <Image onClick={()=>{expand ? setExpand(false): setExpand(true)}}
          src={assets.menu_icon} alt=''/>
          <Image className='opacity-70'src={assets.chat_icon} alt=''/>
        </div>
       

        {messages.length===0 ? (
          <>
         
           <div className="flex  items-center gap-3 justify-center">
            <Image src={assets.logo_icon} className="h-16" alt=''/>
            <p className="text-2xl font-medium">Hi, I am Deepseek</p>
           </div>
           <p className="text-sm mt-2">How can I help you today</p>
        
          </>
        ):
        (
          <div>
            <Message role='user' content='what is html'/>
          </div>
        )
        }

        <PromptBox isLoading={loading} setIsLoading={setLoading}/>

      </div>
    </div>
  );
}
