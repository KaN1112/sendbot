"use client";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Send, Save, Hash } from "lucide-react";
type Channel = { id: string; name: string; category: string };
type Field = { name: string; value: string; inline: boolean };
type Button = {
  label: string;
  style: "Primary" | "Secondary" | "Success" | "Danger" | "Link";
  customId: string;
  url: string;
  emoji: string;
};
const emptyButton: Button = {
  label: "",
  style: "Primary",
  customId: "",
  url: "",
  emoji: "",
};
export function MessageWorkspace({ guildId }: { guildId: string }) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [channelId, setChannelId] = useState("");
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [color, setColor] = useState("#5865F2");
  const [author, setAuthor] = useState("");
  const [authorUrl, setAuthorUrl] = useState("");
  const [authorIcon, setAuthorIcon] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [image, setImage] = useState("");
  const [footer, setFooter] = useState("");
  const [footerIcon, setFooterIcon] = useState("");
  const [timestamp, setTimestamp] = useState(false);
  const [fields, setFields] = useState<Field[]>([]);
  const [buttons, setButtons] = useState<Button[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`/api/guilds/${guildId}/channels`)
      .then((r) => r.json())
      .then((j) => {
        if (j.success) {
          setChannels(j.data);
          setChannelId(j.data[0]?.id ?? "");
        } else setStatus(j.error.message);
      })
      .finally(() => setLoading(false));
  }, [guildId]);
  const embed = useMemo(
    () => ({
      title,
      description,
      url,
      color,
      author: { name: author, url: authorUrl, iconURL: authorIcon },
      thumbnail,
      image,
      footer: { text: footer, iconURL: footerIcon },
      timestamp,
      fields,
    }),
    [
      title,
      description,
      url,
      color,
      author,
      authorUrl,
      authorIcon,
      thumbnail,
      image,
      footer,
      footerIcon,
      timestamp,
      fields,
    ],
  );
  async function submit() {
    setStatus("Sending...");
    const r = await fetch(`/api/guilds/${guildId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        channelId,
        content,
        embeds: title || description || fields.length ? [embed] : [],
        components: buttons,
      }),
    });
    const j = await r.json();
    setStatus(j.success ? "Message sent successfully" : j.error.message);
  }
  async function save() {
    const name = prompt("Template name");
    if (!name) return;
    setStatus("Saving...");
    const r = await fetch(`/api/guilds/${guildId}/templates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        content,
        embedData: embed,
        componentData: buttons,
      }),
    });
    const j = await r.json();
    setStatus(j.success ? "Template saved" : j.error.message);
  }
  return (
    <main className="p-4 sm:p-6 xl:p-8">
      <div className="mb-6">
        <p className="text-sm font-semibold text-[#8991f7]">Message composer</p>
        <h1 className="mt-1 text-2xl font-bold">新しいメッセージ</h1>
      </div>
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,.82fr)]">
        <section className="card divide-y divide-line overflow-hidden">
          <div className="p-5">
            <label className="label">投稿先チャンネル</label>
            <select
              className="field"
              value={channelId}
              disabled={loading}
              onChange={(e) => setChannelId(e.target.value)}
            >
              {loading ? (
                <option>Loading channels…</option>
              ) : (
                channels.map((c) => (
                  <option value={c.id} key={c.id}>
                    {c.category ? `${c.category} / ` : ""}# {c.name}
                  </option>
                ))
              )}
            </select>
          </div>
          <div className="p-5">
            <label className="label">
              Content{" "}
              <span className="float-right font-normal">
                {content.length}/2000
              </span>
            </label>
            <textarea
              className="field min-h-28 resize-y"
              maxLength={2000}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="メッセージ本文を入力"
            />
          </div>
          <div className="p-5">
            <h2 className="font-bold">Embed</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Title" value={title} set={setTitle} max={256} />
              <Field label="URL" value={url} set={setUrl} type="url" />
              <div className="sm:col-span-2">
                <label className="label">Description</label>
                <textarea
                  className="field min-h-24"
                  maxLength={4096}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div>
                <label className="label">Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    className="h-11 w-14 rounded border border-line bg-transparent p-1"
                    value={/^#[0-9a-f]{6}$/i.test(color) ? color : "#5865F2"}
                    onChange={(e) => setColor(e.target.value)}
                  />
                  <input
                    className="field"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    pattern="#[0-9A-Fa-f]{6}"
                  />
                </div>
              </div>
              <Field
                label="Author name"
                value={author}
                set={setAuthor}
                max={256}
              />
              <Field label="Author URL" value={authorUrl} set={setAuthorUrl} />
              <Field
                label="Author icon URL"
                value={authorIcon}
                set={setAuthorIcon}
              />
              <Field
                label="Thumbnail URL"
                value={thumbnail}
                set={setThumbnail}
              />
              <Field label="Image URL" value={image} set={setImage} />
              <Field
                label="Footer text"
                value={footer}
                set={setFooter}
                max={2048}
              />
              <Field
                label="Footer icon URL"
                value={footerIcon}
                set={setFooterIcon}
              />
              <label className="flex items-center gap-2 text-sm text-muted">
                <input
                  type="checkbox"
                  checked={timestamp}
                  onChange={(e) => setTimestamp(e.target.checked)}
                />{" "}
                Add current timestamp
              </label>
            </div>
            <div className="mt-5 space-y-3">
              {fields.map((f, i) => (
                <div className="rounded-lg border border-line p-3" key={i}>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input
                      className="field"
                      placeholder="Field name"
                      maxLength={256}
                      value={f.name}
                      onChange={(e) =>
                        setFields(
                          fields.map((x, n) =>
                            n === i ? { ...x, name: e.target.value } : x,
                          ),
                        )
                      }
                    />
                    <input
                      className="field"
                      placeholder="Field value"
                      maxLength={1024}
                      value={f.value}
                      onChange={(e) =>
                        setFields(
                          fields.map((x, n) =>
                            n === i ? { ...x, value: e.target.value } : x,
                          ),
                        )
                      }
                    />
                  </div>
                  <div className="mt-2 flex justify-between">
                    <label className="text-sm text-muted">
                      <input
                        type="checkbox"
                        checked={f.inline}
                        onChange={(e) =>
                          setFields(
                            fields.map((x, n) =>
                              n === i ? { ...x, inline: e.target.checked } : x,
                            ),
                          )
                        }
                      />{" "}
                      Inline
                    </label>
                    <button
                      aria-label="Remove field"
                      onClick={() =>
                        setFields(fields.filter((_, n) => n !== i))
                      }
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              <button
                className="btn border border-line bg-[#252a32] text-sm"
                disabled={fields.length >= 25}
                onClick={() =>
                  setFields([...fields, { name: "", value: "", inline: false }])
                }
              >
                <Plus size={16} />
                フィールド追加
              </button>
            </div>
          </div>
          <div className="p-5">
            <h2 className="font-bold">
              Buttons{" "}
              <span className="text-xs font-normal text-muted">最大5個</span>
            </h2>
            <div className="mt-4 space-y-3">
              {buttons.map((b, i) => (
                <div
                  className="grid gap-2 rounded-lg border border-line p-3 sm:grid-cols-2"
                  key={i}
                >
                  <input
                    className="field"
                    placeholder="Label"
                    maxLength={80}
                    value={b.label}
                    onChange={(e) =>
                      setButtons(
                        buttons.map((x, n) =>
                          n === i ? { ...x, label: e.target.value } : x,
                        ),
                      )
                    }
                  />
                  <select
                    className="field"
                    value={b.style}
                    onChange={(e) =>
                      setButtons(
                        buttons.map((x, n) =>
                          n === i
                            ? { ...x, style: e.target.value as Button["style"] }
                            : x,
                        ),
                      )
                    }
                  >
                    {["Primary", "Secondary", "Success", "Danger", "Link"].map(
                      (s) => (
                        <option key={s}>{s}</option>
                      ),
                    )}
                  </select>
                  <input
                    className="field"
                    placeholder={b.style === "Link" ? "https://…" : "Custom ID"}
                    value={b.style === "Link" ? b.url : b.customId}
                    onChange={(e) =>
                      setButtons(
                        buttons.map((x, n) =>
                          n === i
                            ? {
                                ...x,
                                [b.style === "Link" ? "url" : "customId"]:
                                  e.target.value,
                              }
                            : x,
                        ),
                      )
                    }
                  />
                  <div className="flex gap-2">
                    <input
                      className="field"
                      placeholder="Emoji"
                      value={b.emoji}
                      onChange={(e) =>
                        setButtons(
                          buttons.map((x, n) =>
                            n === i ? { ...x, emoji: e.target.value } : x,
                          ),
                        )
                      }
                    />
                    <button
                      aria-label="Remove button"
                      onClick={() =>
                        setButtons(buttons.filter((_, n) => n !== i))
                      }
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              <button
                className="btn border border-line bg-[#252a32] text-sm"
                disabled={buttons.length >= 5}
                onClick={() => setButtons([...buttons, { ...emptyButton }])}
              >
                <Plus size={16} />
                ボタン追加
              </button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 p-5">
            <button
              className="btn btn-primary"
              disabled={!channelId || (!content && !title && !description)}
              onClick={submit}
            >
              <Send size={17} />
              Send Message
            </button>
            <button
              className="btn border border-line bg-[#252a32]"
              onClick={save}
            >
              <Save size={17} />
              テンプレートとして保存
            </button>
            {status && (
              <span role="status" className="text-sm text-muted">
                {status}
              </span>
            )}
          </div>
        </section>
        <aside className="card sticky top-20 overflow-hidden">
          <div className="border-b border-line px-5 py-4 text-sm font-bold">
            Live preview
          </div>
          <div className="min-h-[420px] bg-[#313338] p-5">
            <div className="mb-5 flex items-center gap-2 text-sm text-[#949ba4]">
              <Hash size={18} /> preview
            </div>
            <div className="flex gap-3">
              <Image
                src="/send-bot-icon.png"
                alt=""
                width={40}
                height={40}
                className="size-10 shrink-0 rounded-full"
              />
              <div className="min-w-0 flex-1">
                <div>
                  <strong>Send bot</strong>{" "}
                  <span className="rounded bg-blurple px-1 py-.5 text-[10px] font-bold">
                    APP
                  </span>{" "}
                  <span className="text-xs text-[#949ba4]">
                    今日{" "}
                    {new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                {content && (
                  <p className="mt-1 whitespace-pre-wrap break-words text-[15px]">
                    {content}
                  </p>
                )}
                {(title || description || fields.length > 0) && (
                  <div
                    className="relative mt-2 max-w-[520px] overflow-hidden rounded bg-[#2b2d31] p-4 pl-5"
                    style={{
                      borderLeft: `4px solid ${/^#[0-9a-f]{6}$/i.test(color) ? color : "#5865F2"}`,
                    }}
                  >
                    {author && (
                      <div className="mb-2 text-sm font-semibold">{author}</div>
                    )}
                    {title && <div className="font-bold">{title}</div>}
                    {description && (
                      <div className="mt-2 whitespace-pre-wrap text-sm text-[#dbdee1]">
                        {description}
                      </div>
                    )}
                    <div className="mt-3 grid grid-cols-3 gap-3">
                      {fields.map((f, i) => (
                        <div className={f.inline ? "" : "col-span-3"} key={i}>
                          <b className="text-sm">{f.name || "Field name"}</b>
                          <p className="text-sm text-[#dbdee1]">
                            {f.value || "Field value"}
                          </p>
                        </div>
                      ))}
                    </div>
                    {image && (
                      <img
                        alt="Embed"
                        className="mt-4 max-h-64 rounded object-cover"
                        src={image}
                      />
                    )}{" "}
                    {footer && (
                      <div className="mt-3 text-xs text-[#b5bac1]">
                        {footer}
                        {timestamp && " • Today"}
                      </div>
                    )}
                  </div>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  {buttons.map((b, i) => (
                    <button
                      className={`rounded px-4 py-2 text-sm font-semibold ${b.style === "Primary" ? "bg-[#5865f2]" : b.style === "Success" ? "bg-[#248046]" : b.style === "Danger" ? "bg-[#da373c]" : "bg-[#4e5058]"}`}
                      key={i}
                    >
                      {b.emoji} {b.label || "Button"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
function Field({
  label,
  value,
  set,
  max,
  type = "text",
}: {
  label: string;
  value: string;
  set: (v: string) => void;
  max?: number;
  type?: string;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        className="field"
        type={type}
        maxLength={max}
        value={value}
        onChange={(e) => set(e.target.value)}
      />
    </div>
  );
}
