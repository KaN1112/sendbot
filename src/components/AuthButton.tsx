import { signIn, signOut } from "@/auth";
export function LoginButton(){return <form action={async()=>{"use server";await signIn("discord",{redirectTo:"/dashboard"})}}><button className="btn btn-primary" type="submit">Discordでログイン</button></form>}
export function LogoutButton(){return <form action={async()=>{"use server";await signOut({redirectTo:"/"})}}><button className="text-sm text-muted hover:text-white" type="submit">ログアウト</button></form>}
