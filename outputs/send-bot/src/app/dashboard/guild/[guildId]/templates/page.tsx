import { TemplatesView } from "@/components/DataPages";export default async function Page({params}:{params:Promise<{guildId:string}>}){return <TemplatesView guildId={(await params).guildId}/>}
