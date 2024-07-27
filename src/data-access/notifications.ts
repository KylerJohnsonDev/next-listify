import { db } from "@/db";
import { getListByListId } from "@/data-access/list";
import { getProfile } from "@/data-access/profiles";
import { getUser } from "@/data-access/users";

export enum NOTIFICATION_TYPE {
  listInvitation = 0
}

export async function createNotification(
  fromUserId: number,
  forUserId: number,
  listId: number,
  notificationType: NOTIFICATION_TYPE = NOTIFICATION_TYPE.listInvitation
) {
  const user = await getUser(fromUserId);
  const profile = await getProfile(fromUserId)
  const list = await getListByListId(listId)

  const fromUserIdentifier = profile?.displayName ?? user?.email
  const message = `${fromUserIdentifier} invited you as a collaborator to ${list?.name}`

  return db.notification.create({
    data: {
      message,
      resourceId: listId,
      forUserId,
      fromUserId,
      typeId: notificationType
    }
  })
}

export async function getNotificationsByUserId(userId: number) {
  return db.notification.findMany({
    where: { forUserId: userId, isActive: true }
  })
}

export async function acceptNotification(notificationId: number) {
  const notification = await db.notification.findUnique({
    where: { id: notificationId },
  })

  if(!notification) {
    throw new Error(`Could not accept notification`)
  }

  // TODO: add logic to perform different operations based on notification type
  // today the only notification type is list_invite so we'll just worry about handling that

  await db.listUsers.create({
    data: {
      userId: notification.forUserId,
      listId: notification.resourceId
    }
  })

}

export async function deleteNotification(notificationId: number) {
  return db.notification.update({
    where: { id: notificationId },
    data: {
      isActive: false
    }
  })
}

