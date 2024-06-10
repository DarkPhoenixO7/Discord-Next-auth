
import useCurrentUser from "@/hooks/use-current-user";
import { db } from "@/lib/db";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";

export const currentProfile = async ()=>{
    const user =await useCurrentUser();

    if(!user){
        return 
    }

    if(!user.id){
        return null;
    }

    const profile = await db.profile.findUnique({
        where:{
             userId:user.id
        }
    });

    return profile;
}