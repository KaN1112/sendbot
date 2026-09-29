import type { Config } from "tailwindcss";
export default { content: ["./src/**/*.{ts,tsx}"], theme: { extend: { colors: { ink:"#0f1115", panel:"#16191f", card:"#1c2027", line:"#2b313b", blurple:"#5865F2", muted:"#B5BAC1" } } }, plugins: [] } satisfies Config;
