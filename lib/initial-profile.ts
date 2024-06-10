
import { db } from "@/lib/db";
import { currentProfile } from "./current-profile";
import { redirect, useRouter } from "next/navigation";
import useCurrentUser from "@/hooks/use-current-user";

export default async function initialProfile(){
    const user = await useCurrentUser();
    if(!user){
        return redirect("/auth/login");
    }

    const profile = await db.profile.findUnique({
        where:{
            userId: user.id
        }
    });

    if(profile){
        return profile;
    }

    const newProfile = await db.profile.create({
        
        data:{
            userId: user.id,
            name: user.name,
            imageUrl: user.image,
            email: user.email

        },
        include:{
            user:true
        }
    })

    return newProfile;
}