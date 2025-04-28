import React, { useState } from 'react'
import { assets } from '@/assets/assets'
import Image from 'next/image'
import { useClerk, UserButton } from '@clerk/nextjs'
import { useAppcontext } from '@/context/Appcontext'
import Chatlabel from './Chatlabel'

const Sidebar = ({ expand, setExpand }) => {

  const {openSignIn} = useClerk()
  const {user} = useAppcontext()

  const[openMenu, setOpenMenu] = useState({id:0, open:false})

  return (
    <div className={`flex flex-col justify-between transition-all z-50 pt-7 max-md:absolute max-md:h-screen bg-[#212327] 
                       ${expand ? 'p-4 w-64' : 'w-0 md:w-20 max-md:overflow-hidden'}`}>

      <div className=''>

        <div className={`flex ${expand ? 'flex-row gap-6' : 'flex-col items-center gap-8 '}`}>
          <Image className={`${expand ? 'w-36' : 'w-10'}}`} src={expand ? assets.logo_text : assets.logo_icon} alt='' />

           <div onClick={() => { expand ? setExpand(false) : setExpand(true) }}
             className='group relative flex items-center justify-center hover:bg-gray-400/20 transition-all duration-300 aspect-square h-8 w-8 rounded-lg cursor-pointer'>
              <Image src={assets.menu_icon} className='md:hidden' alt='' />
              <Image src={expand ? assets.sidebar_close_icon : assets.sidebar_icon} alt='' className='hidden md:block w-7' />


              <div className={`absolute w-max ${expand ? 'left-1/2 -translate-x-1/2 top-12' : '-top-12 left-0'} 
                           opacity-0 group-hover:opacity-100 transition bg-black text-white px-3 py-2 text-sm rounded-lg shadow-lg pointer-events-none`}>
              {expand ? 'close sidebar' : 'open sidebar'}


                <div className={`h-3 w-3 absolute bg-black rotate-45 ${expand ? 'left-1/2 -top-1.5 -translate-x-1/2'
                : 'left-4 -bottom-1.5'}`}>

                </div>
            </div>

          </div>


        </div>

        <button className={`mt-8 flex items-center justify-center cursor-pointer
            ${expand ? 'bg-primary hover:opacity-90 rounded-2xl gap-2 p-2.5 w-max' :
            'group relative h-9 w-9 mx-auto hover:bg-gray-500/30 rounded-lg'}`}>

          <Image className={expand ? 'w-6' : 'w-7'}
            src={expand ? assets.chat_icon : assets.chat_icon_dull} alt='' />
            
          <div className='absolute w-max -top-12 -right-12 opacity-0 group-hover:opacity-100 transition bg-black text-sm text-white
                                 px-3 py-2 rounded-lg shadow-lg pointer-events-none'>
            New Chat
            <div className='w-3 h-3 bg-black absolute rotate-45 left-4 -bottom-1.5'>

            </div>

          </div>
          {expand && <p className='text-white font-medium'>New Chat</p>}
        </button>



        <div className={`mt-8 text-white/25 text-sm ${expand ? 'block' : 'hidden'}`}>
          <p className='my-1'>Recents</p>
          <Chatlabel openMenu={openMenu} setOpenMenu={setOpenMenu}/>

        </div>

      </div>


      {/***------profile section-------------- */}

      <div onClick={user ? null : openSignIn}
      className={`flex items-center ${expand ? 'hover:bg-white/10 rounded-lg' : 'justify-center w-full'}
                                                 gap-3 text-white/60  p-2 mt-4 cursor-pointer `}>
        {
          user ? <UserButton/> : <Image src={assets.profile_icon} className='w-7' alt='' />
        }                                          
       
        {expand && <span>My Profile</span>}
      </div>



    </div>
  )
}

export default Sidebar
