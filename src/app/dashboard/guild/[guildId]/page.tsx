import { redirect } from "next/navigation";export default async function Page({params}:{params:Promise<{guildId:string}>}){redirect(`/dashboard/guild/${(await params).guildId}/messages`)}
