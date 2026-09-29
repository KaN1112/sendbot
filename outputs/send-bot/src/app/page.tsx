import Link from "next/link";
import { MessageSquareText, ShieldCheck, WandSparkles } from "lucide-react";
import { auth } from "@/auth";
import { LoginButton } from "@/components/AuthButton";
export default async function Home() {
  const session = await auth();
  return (
    <main className="min-h-screen">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3 font-extrabold">
          <span className="grid size-9 place-items-center rounded-lg bg-blurple">
            S
          </span>
          Send bot
        </div>
        <span className="text-sm text-muted">
          Discord operations, clearly managed.
        </span>
      </nav>
      <section className="mx-auto grid min-h-[66vh] max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.05fr_.95fr]">
        <div>
          <div className="mb-5 inline-flex rounded-full border border-line bg-card px-3 py-1 text-sm text-muted">
            Secure bot management console
          </div>
          <h1 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl">
            投稿管理を、
            <br />
            <span className="text-[#8891f7]">Discordの外側から。</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
            メッセージ、Embed、ボタンを一つの画面で組み立て、権限を確認して安全に送信。運用チームのための落ち着いた管理画面です。
          </p>
          <div className="mt-8 flex items-center gap-3">
            {session ? (
              <Link href="/dashboard" className="btn btn-primary">
                ダッシュボードを開く
              </Link>
            ) : (
              <LoginButton />
            )}
            <a
              href="#features"
              className="btn border border-line bg-card text-white"
            >
              機能を見る
            </a>
          </div>
        </div>
        <div className="card overflow-hidden shadow-2xl shadow-black/30">
          <div className="flex items-center gap-2 border-b border-line px-5 py-4">
            <i className="size-2.5 rounded-full bg-[#ed4245]" />
            <i className="size-2.5 rounded-full bg-[#f0b232]" />
            <i className="size-2.5 rounded-full bg-[#3ba55c]" />
            <span className="ml-2 text-xs text-muted"># announcements</span>
          </div>
          <div className="bg-[#313338] p-6">
            <div className="flex gap-4">
              <div className="grid size-10 shrink-0 place-items-center rounded-full bg-blurple font-bold">
                S
              </div>
              <div className="min-w-0">
                <div className="font-semibold">
                  Send bot{" "}
                  <b className="ml-1 rounded bg-blurple px-1 py-.5 text-[10px]">
                    APP
                  </b>{" "}
                  <span className="text-xs font-normal text-[#949ba4]">
                    今日 12:30
                  </span>
                </div>
                <p className="mt-1 text-sm">
                  新しいアップデートを公開しました。
                </p>
                <div className="mt-3 max-w-md rounded border-l-4 border-[#5865f2] bg-[#2b2d31] p-4">
                  <strong>Release 1.4</strong>
                  <p className="mt-1 text-sm text-[#dbdee1]">
                    チーム向け通知とテンプレート機能が利用できます。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        id="features"
        className="mx-auto grid max-w-6xl gap-4 px-6 pb-20 md:grid-cols-3"
      >
        {[
          [
            MessageSquareText,
            "Message composer",
            "通常文、Embed、ボタンを一画面で編集。",
          ],
          [
            WandSparkles,
            "Live preview",
            "入力内容をDiscord風プレビューへ即時反映。",
          ],
          [
            ShieldCheck,
            "Permission aware",
            "サーバーとチャンネルの権限を送信時にも検証。",
          ],
        ].map(([Icon, title, text]) => (
          <div className="card p-6" key={String(title)}>
            <Icon className="mb-5 text-[#8991f7]" />
            <h2 className="font-bold">{String(title)}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{String(text)}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
