import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { PrismaClient } from "@prisma/client";

export const db = new PrismaClient();

const adapter = new PrismaAdapter(db.session, db.user);

