import { auth } from "@/auth";
import { getUserById } from "@/data/user";
import { getSession, useSession } from "next-auth/react";

export default async function useCurrentUser (){
  const session = await auth();
  console.log(session)
  const userId = session?.user.id;

  const user = getUserById(userId as string);

  if (!user) {
    return null;
  }

  return user;
};