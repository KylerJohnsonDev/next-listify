import { db } from "@/db";
import { Profile } from "@/db/schema";
import { UserId } from "@/use-cases/types";

export async function createProfile(
  userId: UserId,
  displayName: string,
  image?: string,
) {

  const profile = await db.profile.upsert({
    create: {
      userId,
      displayName,
      image
    },
    update: {},
    where: {
      userId
    }
  })

  return profile;
}

export async function updateProfile(
  userId: UserId,
  updateProfile: Partial<Profile>,
) {
  await db.profile.update({
    data: {...updateProfile},
    where: {
      userId, 
    }
  })
}

export async function getProfile(userId: UserId) {
  const profile = await db.profile.findFirst({
    where: {
      userId
    }
  })

  return profile;
}
