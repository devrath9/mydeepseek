import { assets } from '@/assets/assets'
import React, { useEffect } from 'react'
import Image from 'next/image'
import Markdown from 'react-markdown'
import Prism from 'prismjs'
import toast from 'react-hot-toast'

const Message = ({role, content}) => {


  useEffect(()=>{
      Prism.highlightAll()
  },[content])

  const copymessage = ()=>{
    navigator.clipboard.writeText(content)
    toast.success('Message copied to clipboard')
  }


  return (
    <div className='flex flex-col items-center w-full max-w-3xl text-sm'>

        <div className={`flex flex-col w-full mb-8 ${role==="user" && 'items-end'}`}>

            <div className={`group relative flex max-w-2xl py-3 rounded-xl 
                            ${role==='user' ?'bg-[#414158] px-5':'gap-3'}`}>

                <div className={`opacity-0 group-hover:opacity-100 absolute ${role==='user' ?'-left-12 '
                                                                                    :'left-9 -bottom-2'} transition-all`}>

                      <div className='flex items-center gap-2 opacity-70'>
                        {
                            role==='user' 
                            ?(<>
                             
                             <Image onClick={copymessage}
                                src={assets.copy_icon} className='w-4 cursor-pointer' alt=''/>
                             <Image src={assets.pencil_icon} className='w-4 cursor-pointer' alt=''/>
                            
                              </>)
                            :(<>
                              
                              <Image onClick={copymessage}
                                src={assets.copy_icon} className='w-4 cursor-pointer' alt=''/>
                              <Image src={assets.regenerate_icon} className='w-4 cursor-pointer' alt=''/>
                              <Image src={assets.like_icon} className='w-4 cursor-pointer' alt=''/>
                              <Image src={assets.dislike_icon} className='w-4 cursor-pointer' alt=''/>

                              </>)
                        }
                     </div>                                                                  

                </div>  

                {
                    role==='user' 
                    ?(
                        <span className='text-white/90'>{content}</span>
                    )
                    :(   
                       <>
                       <Image src={assets.logo_icon} 
                         className='h-9 w-9 p-1 border border-white/15 rounded-full'alt=''/>

                         <div className='space-y-2 w-full '>
                          <Markdown>{content}</Markdown>
                          </div>
                       </>
                        

                    )
                }              

            </div>

        </div>
      
    </div>
  )
}

export default Message
