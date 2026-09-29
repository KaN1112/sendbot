# Send bot

Discord BotをWeb管理画面から安全に操作し、通常メッセージ、Embed、ボタンを任意のサーバー／チャンネルへ投稿するNext.jsアプリです。Bot TokenやClient Secretはサーバー側だけで扱います。

## 主な機能

- Discord OAuth2 (`identify`, `guilds`) ログイン
- Administrator / Manage Guild権限を持つサーバーだけを表示
- Bot参加状態と最小権限の招待リンク
- Botが閲覧・送信可能なテキスト／アナウンスチャンネルの取得
- 通常メッセージ、Embed、Fields、Buttonの編集とDiscord風ライブプレビュー
- 送信時のサーバー権限・チャンネル所属・Bot権限の再検証
- 10秒5回のユーザー単位レート制限（単一プロセス用）
- PostgreSQLへのテンプレート保存と監査ログ
- Bot自身の送信メッセージだけを編集・削除するAPI
- レスポンシブなダークテーマUI
- 予約投稿のDBモデルと拡張用UI

## 技術構成

Node.js 20+ / TypeScript / Next.js App Router / React / Tailwind CSS / Auth.js / discord.js v14 / PostgreSQL / Prisma

## セットアップ

```bash
npm install
copy .env.example .env.local
npm run prisma:generate
npm run prisma:migrate
npm run dev:all
```

Webのみは `npm run dev`、Botのみは `npm run bot`。本番は `npm run build` の後に `npm start` と `npm run bot` を別プロセスで起動します。

## Discord Developer Portal

1. Applicationsでアプリを作成し、BotページからBotを作成します。
2. Bot Tokenを再生成し、`DISCORD_BOT_TOKEN` に設定します。公開・コミットしないでください。
3. OAuth2 > GeneralでClient ID / Client Secretを取得します。
4. Redirectsに `http://localhost:3000/api/auth/callback/discord` を追加します。本番ではHTTPSの本番URLも登録します。
5. OAuth2 URL Generatorで `bot` と `applications.commands` を選択します。Administratorは選択しません。
6. 推奨権限: View Channels, Send Messages, Embed Links, Attach Files, Read Message History, Manage Messages。実装の招待URLは必要最小限の権限整数を使用します。
7. OAuthログインでは `identify guilds` scopeを利用します。

## 環境変数

| 名前                    | 用途                                     |
| ----------------------- | ---------------------------------------- |
| `DISCORD_BOT_TOKEN`     | Botの秘密トークン                        |
| `DISCORD_CLIENT_ID`     | Application ID                           |
| `DISCORD_CLIENT_SECRET` | OAuth Client Secret                      |
| `DISCORD_REDIRECT_URI`  | OAuth callback URL（Portalと一致させる） |
| `AUTH_SECRET`           | `npx auth secret` 等で生成するランダム値 |
| `AUTH_URL`              | Webアプリの公開URL                       |
| `DATABASE_URL`          | PostgreSQL接続文字列                     |

## PostgreSQL / Prisma

空のPostgreSQLデータベースを作成し、`DATABASE_URL` を設定してから `npm run prisma:migrate -- --name init` を実行します。デプロイ環境では `prisma migrate deploy` を使ってください。

## API

- `GET /api/guilds`
- `GET /api/guilds/:guildId/channels`
- `POST /api/guilds/:guildId/messages`
- `PATCH|DELETE /api/guilds/:guildId/messages/:messageId`
- `GET|POST /api/guilds/:guildId/templates`
- `GET /api/guilds/:guildId/logs`

レスポンスは `{ success: true, data }` または `{ success: false, error: { code, message } }` に統一しています。

## ファイル構成

- `src/app` — ページとRoute Handler
- `src/components` — Dashboard、Sidebar、Composer、Preview
- `src/lib` — Discord、認証、Prisma、権限、検証、Rate Limit
- `src/bot` — discord.js常駐Bot
- `prisma/schema.prisma` — DBスキーマ
- `.env.example` — 秘密値を含まない設定例

## セキュリティ

Bot TokenとClient SecretはClient Componentへ渡しません。各Guild APIは保存済みOAuthアクセストークンでDiscordの最新Guild権限を確認します。Reactの通常描画を使い、`dangerouslySetInnerHTML` は使用しません。Auth.jsのSameSite CookieとOrigin検証に加え、すべての変更APIで認証・認可を再確認します。本番の複数インスタンスではインメモリRate LimitをRedis/Upstash等へ置換してください。

## 未実装・拡張候補

- 予約投稿Worker（スキーマとUIは準備済み）
- テンプレートの編集・複製・削除UIとAPI
- ログ画面からの本文プレビュー、編集・削除ダイアログ
- Button interactionごとの任意アクション設定
- Redisによる分散Rate Limit、OAuth token refresh、監査ログの検索／ページング
- 画像添付アップロード（現在はEmbed URLのみ）

## 検証コマンド

```bash
npm run prisma:generate
npm run typecheck
npm run lint
npm run build
```

## Renderへ公開する

`render.yaml` は次の3リソースを作成します。

- `send-bot-web`: Next.js管理画面とAPI
- `send-bot-worker`: discord.js常駐Bot
- `send-bot-db`: PostgreSQL

GitHubへ `.env` と `.env.local` を含めずにpushし、Render Dashboardの **New > Blueprint** からリポジトリを選択します。作成画面で以下の秘密値を入力します。

- `DISCORD_CLIENT_ID`
- `DISCORD_CLIENT_SECRET`
- `DISCORD_BOT_TOKEN`
- `AUTH_URL`: `https://send-bot-web.onrender.com`（実際に割り当てられたURL）
- `DISCORD_REDIRECT_URI`: `https://send-bot-web.onrender.com/api/auth/callback/discord`

WebサービスのURLが確定したら、Discord Developer Portalの **OAuth2 > Redirects** に同じCallback URLを追加します。Render上では `.env` ファイルを作らず、DashboardのEnvironment Variablesを使います。

常時接続が必要なBot Workerには、スリープしないインスタンスを選択してください。Webサービスを無料プランにすると無操作時にスリープし、最初のアクセス時だけ起動待ちが発生します。
