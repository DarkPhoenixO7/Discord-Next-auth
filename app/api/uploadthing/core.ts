
import { auth } from "@/auth";
import useCurrentUser from "@/hooks/use-current-user";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
 
const f = createUploadthing();
 
const handleAuth = async()=>{
    const user = await useCurrentUser()
    if(!user?.id) throw new Error("Unathorized");
    return {userId: user.id};
}
 

export const ourFileRouter = {
 serverImage: f({image: {maxFileSize: "4MB", maxFileCount: 1}})
 .middleware(()=> handleAuth())
 .onUploadComplete(()=>{}),
 messageFile: f(["image", "pdf"])
 .middleware(()=>handleAuth())
 .onUploadComplete(()=>{})
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;