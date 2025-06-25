import React from 'react'
import Image from 'next/image'
import { assets } from '@/assets/assets'
import { useAppcontext } from '@/context/Appcontext'
import axios from 'axios'
import toast from 'react-hot-toast'




const Chatlabel = ({ id, name, isToolbarOpen,toggleToolbar, openRename, openDelete}) => {


  const {chats, setSelectedChat} = useAppcontext()

  


  //function to navigate between chats 
const selectChat = ()=>{
   const chatData = chats.find(chat =>chat._id===id)
   setSelectedChat(chatData)
   
}


return (
    <div onClick={selectChat} className={`flex items-center justify-between p-2 text-white/80
                      hover:bg-white/10 rounded-lg text-sm group cursor-pointer `}>

      <p className='group-hover:max-w-5/6 truncate  '>{name}</p>

        <div onClick={(e)=>{e.stopPropagation();toggleToolbar()}}
          className='group relative flex items-center justify-center h-6 w-6 aspect-square hover:bg-black/80 rounded-lg'>

            <Image src={assets.three_dots} 
              className={`w-4 hidden group-hover:block`} alt=''/>

           {isToolbarOpen &&( <div className={`absolute right-0 top-6 z-50 bg-gray-700 rounded-xl w-40 p-2`}>

                <div onClick={openRename} className='flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg'>
                    <Image src={assets.pencil_icon} className='w-4'alt=''/>
                    <p>Rename</p>
                </div>

                <div onClick={openDelete} className='flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg'>
                    <Image src={assets.delete_icon} className='w-4'alt=''/>
                    <p>Delete</p>
                </div>

            </div>)}

            <div>

            </div>
        </div>
      
    </div>
  )
}

export default Chatlabel
