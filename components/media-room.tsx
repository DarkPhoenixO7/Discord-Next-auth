"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import {LiveKitRoom, VideoConference} from "@livekit/components-react";
import "@livekit/components-styles"
import { auth } from "@/auth";
import { currentProfile } from "@/lib/current-profile";

interface MediaRoomProps{
    chatId: string,
    video: boolean,
    audio: boolean
}

export const MediaRoom = async({
 chatId,
 video,
 audio
}:MediaRoomProps)=>{

    const user = await currentProfile();
    
    const [token, setToken] = useState("");


    useEffect(()=>{
        if(!user?.firstName || !user.lastName) return;

        const name = `${user.firstName} ${user.lastName}`;

        (async()=>{
            try {
                const resp = await fetch(`/api/livekit?room=${chatId}&username=${name}`);
                const data = await resp.json();
                setToken(data.token);
            } catch (error) {
                console.log(error);
            }
        })();
        
    },[user?.firstName, user?.lastName, chatId]);

    if(token === ""){
        return(
            <div className="flex flex-col flex-1 items-center justify-center">
                <Loader2 className="w-7 h-7 text-zinc-500 animate-spin my-4" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400 ">Loading...</p>

            </div>
        )
    }

    return(
        <LiveKitRoom 
         data-lk-theme= "default"
         serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
         token={token}
         connect={true}
         video={video}
         audio={audio}

        >
            <VideoConference />

        </LiveKitRoom>
    )

}