"use client"

import React, { useState } from 'react'
import { assets } from '@/assets/assets'
import Image from 'next/image'
import { useClerk, UserButton } from '@clerk/nextjs'
import { useAppcontext } from '@/context/Appcontext'
import Chatlabel from './Chatlabel'
import Modal from './Modal'
import ProfileModal from './ProfileModal'
import { useRouter } from 'next/navigation'

const Sidebar = ({ expand, setExpand, openSearchModal}) => {

  const {openSignIn, signOut} = useClerk()
  const {user, chats, createNewChat} = useAppcontext()

   const router  = useRouter()

  

  const handleSignOut = async () => {
    await signOut();
    setTimeout(() => {
    window.location.href = '/'; // redirect after 300 ms
  }, 500); 
    
  };

  const [showProfile, setShowProfile] = useState(false)


  

  const [opentoolbarId, setOpentoolbarId] = useState(null)
  const [modalType, setModalType] = useState(null)
  const [activeChat, setActiveChat] = useState(null)
  

  const openRenameModal = (chat)=>{
    setActiveChat(chat);
    setModalType('rename')
  }

  const openDeleteModal = (chat)=>{
    setActiveChat(chat);
    setModalType('delete')
  }


  const closeModal = () => {
  setModalType(null);
  setActiveChat(null);
  };


  const toggleToolbar = (chatId)=>{
    setOpentoolbarId(prev=>(prev===chatId ? null :chatId))
  }

  return (
     <div className={`flex flex-col h-screen justify-between transition-all z-40 pt-3 pb-6 max-md:absolute max-md:h-screen bg-[#212327] 
                       ${expand ? 'p-4 max-sm:w-56 w-64' : 'w-0 md:w-20 max-md:overflow-hidden'}`}>

      {/**----------SECTION1------------------- */}
      <div className='flex flex-col h-28'>

        <div className={`flex items-center ${expand ? 'flex-row justify-between' : 'flex-col gap-4 '}`}>
          <Image className={` ${expand ? 'w-32 p-3' : 'w-10'}}`} src={expand ? assets.logo_text : assets.logo_icon} alt='' />

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

        {/**---------New chat button---------------- */}
        <button onClick={createNewChat}  className={` mt-4 text-[14px] text-gray-400  px-2.5  rounded-xl flex gap-2 cursor-pointer hover:bg-gray-500/30
                            ${expand ? "py-1.5 w-[95%]":"mx-auto mt-2 py-1.5 group relative"}`}>

          <Image className={expand ? 'w-6' : 'w-7'}
            src={expand ? assets.chat_icon : assets.chat_icon_dull} alt='' />
            
          <div className='absolute w-max -top-12 -right-12 opacity-0 group-hover:opacity-100 transition bg-black text-sm text-white
                                 px-3 py-2 rounded-lg shadow-lg pointer-events-none'>
             New Chat
            <div className='w-3 h-3 bg-black absolute rotate-45 left-4 -bottom-1.5'></div>

          </div>

          {expand && <p className='text-white/80 text-sm'>New Chat</p>}
        </button>


         {/**---------Search button---------------- */}
        {user && <button onClick={openSearchModal}
        className={`text-[14px] text-gray-400  px-2.5  rounded-xl flex gap-2 cursor-pointer hover:bg-gray-500/30
                            ${expand ? "mt-0.5 py-1.5 w-[95%]":"mx-auto mt-2 py-1.5 group relative"}`}>

             <Image className= {`${expand? "w-5":"w-6"}`} src={assets.search_icon2}  alt='' />

              <div className='absolute w-max -top-12 -right-16 opacity-0 group-hover:opacity-100 transition bg-black text-sm text-white
                                 px-3 py-2 rounded-lg shadow-lg pointer-events-none'>
                 Search chats
                <div className='w-3 h-3 bg-black absolute rotate-45 left-4 -bottom-1.5'></div>
              </div>

             {expand && <p className=' text-white/80 text-sm'>Search chats</p>}
        </button>}
         </div>

        





          {/***-------------------Section 2 - Recent Chats------------------------------ */}

        <div className={`flex-1 overflow-y-auto mt-6 text-white/25 text-sm ${expand ? 'flex flex-col' : 'hidden'}`}>
    <p className='my-1 px-2'>Recent chats</p>

    <div className='flex-1 sidebar'>
      {chats.map((chat) => (
        <Chatlabel 
          key={chat._id} 
          name={chat.name} 
          id={chat._id} 
          isToolbarOpen={opentoolbarId === chat._id}
          toggleToolbar={() => toggleToolbar(chat._id)}
          openRename={() => openRenameModal(chat)}
          openDelete={() => openDeleteModal(chat)} />
      ))}
    </div>
  </div>

     


      {/***------Section 3 - profile section-------------- */}

     

      {user ? (
        <div className={`sticky bottom-0.5  bg-[#212327] ${expand ? 'border-t border-gray-700 h-8 ' : 'h-10 justify-center flex'}`}>

        <div className={`flex items-center relative 
                    gap-3 text-white/60 p-2 hover:bg-white/10 rounded-lg mt-0.5`}>

          <button onClick={() => setShowProfile(!showProfile)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white font-semibold">
            {user.firstName.charAt(0)}
          </button>

          {showProfile && <div className='absolute -top-55 left-8'>
            <ProfileModal
              username={user.firstName}
              email={user.primaryEmailAddress.emailAddress}
              logout={handleSignOut} />
          </div>}
          {expand && <span className='text-blue-400 font-semibold'>{user.firstName}</span>}
        </div>
        </div>
      ) : (
        // Signed out: Wrap in a clickable div that triggers sign-in
        <button
          onClick={openSignIn}
          className={`flex items-center sticky bottom-0.5 bg-[#212327] ${expand ? 'hover:bg-white/10 rounded-lg' : 'justify-center w-full'}
                gap-3 text-white/60 p-2 cursor-pointer`}
        >
          <Image src={assets.profile_icon} className="w-7" alt="Profile Icon" />
          {expand && <span>My Profile</span>}
        </button>
      )}



      {/**---------------------MODAL COMPONENT--------------------- */}
      <Modal
      type={modalType}
      chat={activeChat}
      onClose={closeModal}
      />



    </div>
  )
}

export default Sidebar
