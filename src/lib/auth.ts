import { GitHub, Google } from "arctic";
import { Lucia } from "lucia";
import { db } from "@/db";
import { cookies } from "next/headers";
import { User } from "lucia";
import { Session } from "lucia";
import { env } from "@/env";
import { UserId as CustomUserId } from "@/types";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();
const adapter = new PrismaAdapter(client.session, client.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      id: attributes.id,
    };
  },
});

export const validateRequest = async (): Promise<
  { user: User; session: Session } | { user: null; session: null }
> => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  console.log('sessionId', sessionId);
  const result = await lucia.validateSession(sessionId);

  // next.js throws when you attempt to set cookie when rendering page
  try {
    if (result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
  } catch {}
  return result;
};

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      id: CustomUserId;
    };
    UserId: CustomUserId;
  }
}

// export const github = new GitHub(
//   env.GITHUB_CLIENT_ID,
//   env.GITHUB_CLIENT_SECRET,
// );

// export const googleAuth = new Google(
//   env.GOOGLE_CLIENT_ID,
//   env.GOOGLE_CLIENT_SECRET,
//   `${env.HOST_NAME}/api/login/google/callback`,
// );
