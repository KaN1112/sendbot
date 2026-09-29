import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canManage,getOAuthGuilds } from "@/lib/discord";
export async function authorizeGuild(guildId:string){ const session=await auth(); if(!session?.user?.id)return null; const account=await prisma.account.findFirst({where:{userId:session.user.id,provider:"discord"}}); if(!account?.access_token)return null; const guild=(await getOAuthGuilds(account.access_token)).find(g=>g.id===guildId); return guild&&canManage(guild)?{session,guild}:null; }
