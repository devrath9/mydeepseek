"use client"

import { assets } from "@/assets/assets"
import Image from "next/image"
import { useAppcontext } from "@/context/Appcontext"
import { useEffect, useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import Searchloader from "./Searchloader"
import { formatdate } from "@/utils/formatDate"

const SearchModal = ({open, onClose}) => {
  const {chats, setSelectedChat} = useAppcontext()
    
    const [query, setQuery] = useState("")
    const [loading, setLoading] = useState(false)
    const [searchResult, setSearchResults] = useState([])

     const searchChats = async(query)=>{
       
         setLoading(true)
         try{
             const {data} = await axios.post('/api/chat/search', {search:query})

             if (!data.success) {
                toast.error(data.message || "Something went wrong");
                  return;
              }
              setSearchResults(data.searchresults)
              console.log(data.searchresults)

         }catch(err){
             console.log(err)
             const errorMessage = err?.response?.data?.message || 'An error occurred';
             toast.error(errorMessage);
         }finally{
             setLoading(false)
         }
     }

     useEffect(()=>{
         if (query.trim()==="") {
          setSearchResults(chats.slice(0,5)); // clear results if empty
          setLoading(false)
        
         return;
        } 
          
        const timer = setTimeout(() => {
        searchChats(query);
    }, 300); // debounce delay in ms

    return () => clearTimeout(timer); // clear on next change
     },[query])

    const selectChat =(id)=>{

        const chatData = chats.find(chat=>chat._id===id)
        setSelectedChat(chatData)
        onClose()
    }


  const renderResults = () => {

    if (loading) {
      return <Searchloader />
    }

    if (!query.trim() || !query) {
      return (
        <ul className="px-2 mt-2">
          <li className="mb-1 italic text-gray-400 text-sm px-2">Recent Chats</li>

          {chats.slice(0,10).map((chat) => (
            <li onClick={() => selectChat(chat._id)}
              key={chat._id} className="group text-white flex justify-between px-2 py-2 text-sm hover:bg-gray-700 rounded-xl cursor-pointer">

              <div className="flex gap-3">
              <Image src={assets.message_icon} alt="" className="w-5 h-5" />
              {chat.name}
              </div>
              <p className="text-xs italic text-gray-400 opacity-0 group-hover:opacity-100">
                {formatdate(chat.createdAt)}
              </p>
              
            </li>
          ))}
        </ul>
      );
    }
    else {
      if (searchResult.length === 0) {
        return <p className="text-white italic ml-4 mt-2">No results</p>;
      } else {
        return (
          <ul className="px-2 mt-2">
            {searchResult.map((chat) => (
              <li onClick={() => selectChat(chat._id)}
              key={chat._id} className="group text-white flex justify-between px-2 py-2 text-sm hover:bg-gray-700 rounded-xl cursor-pointer">
              <div className="flex gap-3">
              <Image src={assets.message_icon} alt="" className="w-5 h-5" />
              {chat.name}
              </div>
              <p className="text-xs italic text-gray-400 opacity-0 group-hover:opacity-100">
                {formatdate(chat.createdAt)}
              </p>
              
            </li>
            ))}
          </ul>
        );
      }
    }
  }






    
  return (

      <div className={`${open ? "flex" : "hidden"}`}>
          <div onClick={onClose}
              className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur">
              <div onClick={e => e.stopPropagation()}
                  className="border border-gray-700  rounded-xl py-1 bg-black w-[90%] h-[90%] lg:w-[45%] lg:h-[60%] flex flex-col">

                {/**----Search Input-------------------------------- */}
                  <div className="border-b border-gray-500 p-1 flex justify-between">
                      <input
                          type="text"
                          value={query}
                          onChange={e=>setQuery(e.target.value)}
                          placeholder="Search chats..."
                          className="px-4 py-2 bg-black text-white font-semibold w-full border-none focus:outline-none focus:ring-0 " 
                      />
                      <span onClick={onClose}
                      className="text-2xl cursor-pointer text-white mx-2">&times;</span>

                  </div>

                  
                  {/**----------------Search results------------------- */}
                    <div className="overflow-auto">{renderResults()}</div>
              </div>

          </div>

      </div>
    
  )
}

export default SearchModal
