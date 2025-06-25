'use client'
import React, { useState,useEffect } from 'react'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import axios from 'axios'
import { useAppcontext } from '@/context/Appcontext'

const Modal = ({type, chat, onClose}) => {

    const { fetchuserChats} = useAppcontext()

    const [inputname, setInputName] = useState(chat?.name || '')
    const [loading, setLoading] = useState(false)

    useEffect(()=>{
        if(type==='rename'){
            setInputName(chat?.name)
        }else{
            setInputName('')
        }
    },[type,chat])

    if(!type) return null;



    //api calls for delete and rename

    const renameChat = async()=>{
        setLoading(true)

      try{
    
        const {data} = await axios.post('/api/chat/rename', {chatId:chat._id, name:inputname})
       if(data.success){
          fetchuserChats()
           // setOpenMenu({id:0, open:false})
           toast.success(data.message)
           onClose()
         }else{
         toast.error(data.message)
        }

     }catch(error){
      toast.error(error.message)
     }finally{
        setLoading(false)
     }
  }

const deleteChat = async()=>{
    setLoading(true)
  
  try{

    const {data} = await axios.post('/api/chat/delete', {chatId:chat._id})
    if(data.success){
        fetchuserChats()
        // setOpenMenu({id:0, open:false})
        toast.success(data.message)
        onClose()
    }else{
      toast.error(data.message)
    }

  }catch(error){
    toast.error(error.message)
  }finally{
    setLoading(false)
  }
}


  return (
    <div className='fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur'>
        <div className='bg-black text-white w-[80%] p-6 rounded-md max-w-md'>
            {type==='rename' && (
                <>
                 <h2 className='text-center font-semibold mb-6 '>Rename Chat</h2>
                 <input type='text' value={inputname} onChange = {(e)=>setInputName(e.target.value)}
                  className='border p-2 w-full mb-8 rounded-md' />

                  

                  <div className='flex justify-between gap-4 px-8'>
                    <button onClick={onClose}
                       className='flex-1 bg-white text-black px-3 py-1.5 rounded-md font-semibold cursor-pointer'>
                        Cancel
                    </button>
                     <button onClick={renameChat} disabled={loading}
                        className='flex-1 flex justify-center bg-white text-black px-3 py-1.5 rounded-md font-semibold cursor-pointer'>
                         {loading ? 
                           <>
                           <Loader2 className='animate-spin'/>
                           </>
                            :<>
                            Rename
                            </>}
                    </button>
                  </div>
                </>
            )}


            {type==='delete' && (
                <>
                 <h2 className='text-center font-semibold mb-6'>Are you sure you want to delete this chat?</h2>
                 
                  <div className='flex justify-center gap-4 px-8'>
                    <button onClick={onClose}
                       className='flex-1 bg-white text-black px-3 py-1.5 rounded-md font-semibold cursor-pointer'>
                        Cancel
                    </button>
                     <button onClick={deleteChat} disabled={loading}
                        className='flex-1 flex justify-center bg-white text-black px-3 py-1.5 rounded-md font-semibold cursor-pointer'>
                        {loading ? 
                           <>
                           <Loader2 className='animate-spin'/>
                           </>
                            :<>
                            Delete
                            </>}
                    </button>
                  </div>
                </>
            )}



        </div>
      
    </div>
  )
}

export default Modal
