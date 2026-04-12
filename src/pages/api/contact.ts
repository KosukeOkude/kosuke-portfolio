import type { APIRoute } from "astro";
import { Resend } from "resend";

export const prerender = false;

const resend = new Resend(import.meta.env.RESEND_API_KEY);
const toEmail = import.meta.env.CONTACT_TO_EMAIL;

export const POST: APIRoute = async ({ request }) => {
  const { name, email, message } = await request.json();

  if (!name || !email || !message) {
    return new Response(JSON.stringify({ message: "必須項目が不足しています。" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { error } = await resend.emails.send({
    from: "Contact Form <onboarding@resend.dev>",
    to: toEmail,
    subject: `【お問い合わせ】${name} 様より`,
    text: `名前: ${name}\nメール: ${email}\n\n${message}`,
  });

  if (error) {
    console.error("Resend error:", error);
    return new Response(
      JSON.stringify({ message: "送信に失敗しました。しばらくしてからお試しください。" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
