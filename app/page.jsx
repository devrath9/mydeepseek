"use client"

import Image from "next/image";
import { assets } from "@/assets/assets";
import { useEffect, useRef, useState } from "react";
import Sidebar from "@/components/Sidebar";
import PromptBox from "@/components/PromptBox";
import Message from "@/components/Message";
import { useAppcontext } from "@/context/Appcontext";
import SearchModal from "@/components/SearchModal";
import { useClerk } from "@clerk/nextjs";

export default function Home() {

   const {openSignIn} = useClerk()
  
  const[expand, setExpand] = useState(false)
  const[loading, setLoading] = useState(false)
  const[messages, setMessages] = useState([])
  const [openSearch, setOpenSearch] = useState(false)

  const {selectedChat, user, createNewChat} = useAppcontext()
  const containerRef = useRef(null)


  useEffect(()=>{
    if(selectedChat){
      setMessages(selectedChat.messages)
    }
  },[selectedChat])

  useEffect(()=>{
    if(containerRef.current){
      containerRef.current.scrollTo({
       top:containerRef.current.scrollHeight,
       behaviour:'smooth'

      })
    }
  },[])

  const openSearchModal = ()=>{
         setOpenSearch(true)
  }

  const handleClose = ()=>{
    setOpenSearch(false)
  }



  

  return (
    <div className="flex h-screen" >
     <Sidebar expand={expand} setExpand={setExpand} openSearchModal={openSearchModal}/>
      <div className="flex-1 flex flex-col justify-center items-center px-4 pb-8  bg-[#292a2d] text-white relative">
        <div className={`md:hidden absolute flex justify-between  items-center w-full top-6 px-4 `}>
          <Image onClick={()=>{expand ? setExpand(false): setExpand(true)}}
          src={assets.menu_icon} alt=''/>
          {user ? <Image onClick={createNewChat} className='opacity-70'src={assets.chat_icon} alt=''/> 
          :<button onClick={openSignIn}
          className="bg-white rounded-xl px-4 py-1.5 font-semibold text-sm cursor-pointer text-black">Login</button>}
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
          <div ref={containerRef}
          className="relative flex flex-col items-center justify-start w-full mt-20 h-screen overflow-y-auto">
            <p className="fixed top-8 border border-transparent py-1 px-2 rounded-lg font-semibold mb-6">{selectedChat.name}</p>
            {messages.map((msg,index)=>(
              
            <Message key={index} role={msg.role} content={msg.content}/>
             ))}

             {
              loading && (
                <div className="flex flex-col gap-4 w-full max-w-3xl py-3">
                  <Image src={assets.logo_icon} alt='Logo' className="h-9 w-9 p-1 rounded-full border border-white/15"/>
                  <div className="loader flex justify-center items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-white animate-bounce"></div>
                    <div className="w-1 h-1 rounded-full bg-white animate-bounce"></div>
                    <div className="w-1 h-1 rounded-full bg-white animate-bounce"></div>
                  </div>
                </div>
                
              )
             }
          </div>
        )
        }
        
        <PromptBox isLoading={loading} setIsLoading={setLoading}/>
        

      </div>
      <SearchModal open={openSearch} onClose={handleClose}/>
    </div>
  );
}
