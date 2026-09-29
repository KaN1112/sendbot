import { LogsView } from "@/components/DataPages";export default async function Page({params}:{params:Promise<{guildId:string}>}){return <LogsView guildId={(await params).guildId}/>}
