import { Client,Events,GatewayIntentBits } from "discord.js";
import { loadEnvFile } from "node:process";
import { existsSync } from "node:fs";

if (existsSync(".env")) loadEnvFile(".env");
const token=process.env.DISCORD_BOT_TOKEN;if(!token)throw new Error("DISCORD_BOT_TOKEN is required");
const client=new Client({intents:[GatewayIntentBits.Guilds]});
client.once(Events.ClientReady,c=>console.log(`Logged in as ${c.user.tag}\nGuild count: ${c.guilds.cache.size}`));
client.on(Events.GuildCreate,g=>console.log(`Joined guild: ${g.name} (${g.id})`));
client.on(Events.GuildDelete,g=>console.log(`Left guild: ${g.name} (${g.id})`));
client.on(Events.InteractionCreate,async i=>{if(!i.isButton())return;await i.reply({content:"This button is not configured yet.",ephemeral:true})});
void client.login(token);
