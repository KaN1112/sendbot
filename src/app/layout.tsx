import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Send bot — Discord management console",
  description: "Create and send Discord messages from a secure web dashboard.",
  icons: { icon: "/send-bot-icon.png", apple: "/send-bot-icon.png" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
