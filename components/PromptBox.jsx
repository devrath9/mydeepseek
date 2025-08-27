import { assets } from '@/assets/assets'
import React ,{useRef, useState} from 'react'
import Image from 'next/image'
import { useAppcontext } from '@/context/Appcontext'
import axios from 'axios'
import toast from 'react-hot-toast'

const PromptBox = ({isLoading,setIsLoading }) => {

   const[prompt, setPrompt] = useState('')
   const {user, chats, setChats,  selectedChat, setSelectedChat} = useAppcontext()


const assistantRef = useRef("")


   const sendPrompt = async(e)=>{
      e.preventDefault()
      const promptcopy = prompt
      setIsLoading(true)

      try{
       if(!user) return toast.error('Login to start messaging')
       if(isLoading) return toast.error('Previous prompt is still in progress') 

        setPrompt('')

        const userPrompt = {
          role:'user',
          content:prompt,
          timestamp: Date.now()
        }

        //saving userprompt in chats array
        setChats((prevchats)=>prevchats.map((chat)=>chat._id===selectedChat._id 
                                                    ?{...chat, messages:[...chat.messages, userPrompt]}
                                                    :chat))
       //saving userprompt in selected chat
       setSelectedChat(prev=>({
        ...prev,
        messages:[...prev.messages, userPrompt]
       }))  



       //initialising empty assistant message 
         const assistantMessage = {
           role:'assistant',
            content:'',
            timestamp: Date.now()
         }

       // adding assistant message to selectedChat
         setSelectedChat(prev=>({
          ...prev,
          messages:[...prev.messages, assistantMessage]
      }))  
       
       //API CALL via FETCH since axios does not support streaming
       const res = await fetch('/api/chat/ai',{
        method:"POST",
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chatId:selectedChat._id,
           prompt
        })
      })

      // if(!res.ok || !res.body){
      //   throw new Error(" Failed to stream response")
      // }

      //handling errors
       if(!res.ok){
         const error = await res.json()
         toast.error(error.message ||"AI Streaming response failed")
         return
        
       }

      //decoding and adding chunks 
        const reader = res.body.getReader()
         const decoder = new TextDecoder()
         
         let animationFrameId = null
         let finalmessage = ""

         //flag to  schedule ui update
          let isUpdateScheduled = false

          const updateUI = ()=>{
            if(isUpdateScheduled) return;

             isUpdateScheduled = true 

             animationFrameId = requestAnimationFrame(()=>{

                const newAssistant = {...assistantMessage, content:assistantRef.current}

                setSelectedChat(prev=>{
                   const updatedMessages = [...prev.messages.slice(0,-1), newAssistant]
                   return {...prev, messages:updatedMessages}
                 })

                 isUpdateScheduled = false

             })
          }

         while(true){
           const {value, done} = await reader.read()
           if(done) break;
           
           const chunk = decoder.decode(value)
           finalmessage+= chunk
           assistantRef.current = finalmessage

           updateUI()  //ui update on next animation frame

          }

          if(animationFrameId) cancelAnimationFrame(animationFrameId) //to prevent next animation when last chunk received

          //One final update to ensure all chunks are in the UI.Just a single state change.

          const fullAssistantMessage = {
            ...assistantMessage,
            content:finalmessage
          }

          

          setSelectedChat(prev=>{
                   const updatedMessages = [...prev.messages.slice(0,-1), fullAssistantMessage]
                    
                   return {...prev,  messages:updatedMessages}
                 })



         // Add to chats as well (fully completed assistant message)

         setChats(prevChats =>
           prevChats.map(chat =>
                 chat._id === selectedChat._id
                       ? { ...chat, messages: [...chat.messages, fullAssistantMessage] }
                       : chat
              )
          );

         
        

     }catch(error){
          toast.error(error.message)
          console.log(error)
          setPrompt(promptcopy)
      }finally{
        setIsLoading(false)
      }




   }

  return (
    <form onSubmit={sendPrompt}
    className={`w-full text-white ${selectedChat?.messages.length>0 ? 'max-w-3xl':'max-w-2xl'}
             bg-[#404045] p-4 rounded-3xl mt-4 transition-all max-md:mb-6`}>

         <textarea
            className='outline-none w-full resize-none overflow-hidden break-words bg-transparent'
            rows={2}
            placeholder="Message Deepseek" required
            onChange={(e)=>setPrompt(e.target.value)}
            value={prompt}/>

         <div className='flex items-center justify-between text-sm '>
           <div className='flex items-center gap-2'>
            <p className='flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer
                          hover:bg-gray-500/20 transition'>
                <Image src={assets.deepthink_icon} alt=''/>
                Deepthink(R1)
            </p>
            <p className='flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer
                          hover:bg-gray-500/20 transition'>
                <Image src={assets.search_icon} alt=''/>
                Search
            </p>
           </div>


             <div className='flex items-center gap-2'>
               <Image className='w-4 cursor-pointer' src={assets.pin_icon} alt=''/>
               <button type='submit'
               className={`${prompt ? 'bg-primary' :'bg-[#71717a]'} rounded-full p-2 cursor-pointer`}>
                  <Image className='w-3.5 aspect-square' src={prompt? assets.arrow_icon: assets.arrow_icon_dull} alt=''/> 
               </button>
             </div>

            
        </div>   
             

    </form>
  )
}

export default PromptBox
