import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/AuthButton";
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/");
  return (
    <div>
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-line bg-panel px-5">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-extrabold"
        >
          <span className="grid size-8 place-items-center rounded-lg bg-blurple">
            S
          </span>
          Send bot
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted">{session.user.name}</span>
          <LogoutButton />
        </div>
      </header>
      {children}
    </div>
  );
}
