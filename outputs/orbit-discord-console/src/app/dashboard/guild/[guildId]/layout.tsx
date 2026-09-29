import { Sidebar } from "@/components/Sidebar";
export default async function GuildLayout({children,params}:{children:React.ReactNode;params:Promise<{guildId:string}>}){const {guildId}=await params;return <div className="lg:flex"><Sidebar guildId={guildId}/><div className="min-w-0 flex-1">{children}</div></div>}
