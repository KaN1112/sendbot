import { ok } from "@/lib/api";

export function GET() {
  return ok({ status: "healthy", service: "send-bot-web" });
}
