import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIo,
){
    if(req.method !== 'POST'){
        return res.status(405).json({error: "Method not allowed"})    
    };

    

    try {
    const profile = await currentProfilePages(req);
    console.log(profile);
    const {content, fileUrl} = req.body;
    const {serverId, channelId} = req.query;

    if(!profile){
        return res.status(401).json({error: "Unathorized"});
    }

    if(!serverId){
        return res.status(400).json({error: "ServerId is missing"});
    }

    if(!channelId){
        return res.status(400).json({error: "ChannelId is missing"});
    }
    
    if(!content){
        return res.status(400).json({error: "Content is missing"});
    }

    const server = await db.server.findFirst({
        where:{
            id: serverId as string,
            members:{
                some:{
                    profileId:profile.id,
                }
            }
        },
        include:{
            members:true,
        }
    });

    if(!server){
        return res.status(404).json({message:"server not found"});
    };

    const channel = await db.channel.findFirst({
        where:{
            id:channelId as string,
            serverId:server.id
        }
    });

    if(!channel){
        return res.status(404).json({message:"Channel not found"});
    }
    
    const member = server.members.find((member)=>member.profileId === profile.id);

    if(!member){
        return res.status(404).json({message:"Member not found"});
    }

    const message = await db.message.create({
        data:{
            content,
            fileUrl,
            channelId: channelId as string,
            memberId: member.id,
        },
        include:{
            member:{
                include:{
                    profile:true
                }
            }
        }

    });

    const channelKey = `chat:${channelId}:messages`;
    res?.socket?.server?.io?.emit(channelKey, message);

    console.log(res.json(message))

    return res.status(200).json(message);

    
    } catch (error) {
       console.log("[Message_Post_Error]", error);
       return res.status(500).json({message:"Internal Error"})
    }
}