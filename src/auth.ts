import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization: { params: { scope: "identify guilds" } },
    }),
  ],
  session: { strategy:"database" },
  callbacks: { session({session,user}) { session.user.id=user.id; session.user.discordId=(user as typeof user & {discordId:string}).discordId; return session; } },
  events: { async signIn({user,account,profile}) { if(account?.provider==="discord" && profile) await prisma.user.update({where:{id:user.id},data:{discordId:String(profile.id),username:String(profile.username),globalName:typeof profile.global_name==="string"?profile.global_name:null,avatar:typeof profile.avatar==="string"?profile.avatar:null}}); } },
  pages: { signIn:"/" }, trustHost:true
});
