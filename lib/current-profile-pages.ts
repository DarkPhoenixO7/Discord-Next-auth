
import { auth } from "@/auth";
import useCurrentUser from "@/hooks/use-current-user";
import { db } from "@/lib/db";
import { NextApiRequest } from "next";

export const currentProfilePages = async (req: NextApiRequest)=>{
    const user = await useCurrentUser(req);
    

    if(!user?.id){
        return null;
    }

    const profile = await db.profile.findUnique({
        where:{
            userId:user.id
        }
    });

    console.log(profile);

    return profile;
}