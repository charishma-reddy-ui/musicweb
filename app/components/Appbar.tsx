"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Music} from "lucide-react";
import { Input } from "@/components/ui/input";



export function Appbar() {
  const session = useSession();
  return (
    <div className="flex justify-between px-20">
      <div className="text-lg font-bold flex flex-col justify-center text-white">Muzer</div>
      {session.data?.user && <Button className ="bg-purple-600 text-white hover:bg-purple-700" onClick={()=>{signOut()}}>signOut</Button>}
      {!session.data?.user && <Button className ="bg-purple-600 text-white hover:bg-purple-700" onClick={()=>{signIn()}}>signIn</Button>}
    </div>
        
     
  )
}
