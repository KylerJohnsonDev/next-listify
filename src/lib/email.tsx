import { Resend } from "resend";

import { env } from "@/env";
import { ReactNode } from "react";

const resend = new Resend(env.EMAIL_SERVER_PASSWORD);

export async function sendEmail(
  email: string,
  subject: string,
  body: ReactNode,
) {
  console.log({emailTo: email, emailFrom: env.EMAIL_FROM})
  const { error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to: email,
    subject,
    react: <>{body}</>,
  });

  if (error) {
    throw error;
  }
}
