import { Client, GatewayIntentBits } from "discord.js";
const globalDiscord = globalThis as unknown as { discordClient?:Client };
export const discord = globalDiscord.discordClient ?? new Client({intents:[GatewayIntentBits.Guilds]});
if (!globalDiscord.discordClient) globalDiscord.discordClient=discord;
export async function ensureDiscord() { if(discord.isReady()) return discord; const token=process.env.DISCORD_BOT_TOKEN; if(!token) throw new Error("DISCORD_BOT_TOKEN is not configured"); await discord.login(token); return discord; }
export type OAuthGuild={id:string;name:string;icon:string|null;permissions:string;owner:boolean};
export async function getOAuthGuilds(accessToken:string):Promise<OAuthGuild[]> { const res=await fetch("https://discord.com/api/v10/users/@me/guilds",{headers:{Authorization:`Bearer ${accessToken}`},cache:"no-store"}); if(!res.ok) throw new Error("Discord guild request failed"); return res.json() as Promise<OAuthGuild[]>; }
export const canManage=(g:OAuthGuild)=>g.owner || (BigInt(g.permissions)&0x20n)!==0n || (BigInt(g.permissions)&0x8n)!==0n;
