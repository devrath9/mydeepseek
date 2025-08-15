"use client"
import { useUser, useAuth } from "@clerk/nextjs"
import { createContext, useContext,useState, useEffect } from "react"
import axios from 'axios'
import toast from "react-hot-toast"

export const Appcontext = createContext()

export const useAppcontext =()=>{ 
    return useContext(Appcontext)
}

export const AppcontextProvider=({children})=>{

    const {user} = useUser()
    const {getToken}  = useAuth()

    const [chats, setChats] = useState([])
    const [selectedChat, setSelectedChat] = useState(null)



    const createNewChat = async()=>{
        try{

          if(!user) {
            toast.error("Login to create new chats")
            return null
        };

          const token = await getToken()

          await axios.post('/api/chat/create', {}, {headers:{
               Authorization:`Bearer ${token}`
          }})

          fetchuserChats()

        }catch(error){
            toast.error(error.message)
        }
    }



    const fetchuserChats = async()=>{
        try{

            const token = await getToken()

          const {data} = await axios.get('/api/chat/get',  {headers:{
               Authorization:`Bearer ${token}`
          }})

          if(data.success){
            console.log(data.data)
            setChats(data.data)

            //if user has no chats, create new chat
             if(data.data.length===0){
                await createNewChat();
                return fetchuserChats()
             }
             else{
                //sort chats by date
                data.data.sort((a,b)=>new Date(b.updatedAt) - new Date(a.updatedAt))

                //set recently updated chat as slected chat
                setSelectedChat(data.data[0])
             }

          }
          else{
            toast.error(data.message)
          }
        }catch(error){
           toast.error(error.message)
        }
    }


    useEffect(()=>{
        if(user)
        fetchuserChats()
        
    },[user])

    const value = {
        user, 
        chats, setChats,
        selectedChat, setSelectedChat, 
        createNewChat,
        fetchuserChats
    }

    return (
        <Appcontext.Provider value={value}>
            {children}
        </Appcontext.Provider>
    )
}