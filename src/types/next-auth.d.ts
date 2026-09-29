import "next-auth";
declare module "next-auth" { interface Session { user: { id:string; discordId:string; name?:string|null; image?:string|null } } }
