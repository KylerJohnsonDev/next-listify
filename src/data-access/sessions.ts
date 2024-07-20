import { db } from "@/db";
import { UserId } from "@/use-cases/types";

export async function deleteSessionForUser(userId: UserId) {
  await db.session.delete({
    where: { userId }
  })
}
