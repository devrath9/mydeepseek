"use client"
import { useUser } from "@clerk/nextjs"
import { createContext, useContext } from "react"

export const Appcontext = createContext()

export const useAppcontext =()=>{ 
    return useContext(Appcontext)
}

export const AppcontextProvider=({children})=>{

    const {user} = useUser()

    const value = {
        user
    }

    return (
        <Appcontext.Provider value={value}>
            {children}
        </Appcontext.Provider>
    )
}