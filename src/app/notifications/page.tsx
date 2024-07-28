import { Card, CardContent } from "@/components/ui/card";
import { getNotificationsByUserId, acceptNotification, deleteNotification } from "@/data-access/notifications";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import Notification from "./notification";
import { revalidatePath } from "next/cache";


export default async function NotificationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const notifications = await getNotificationsByUserId(user.id)

  async function acceptInviteNotification(notificationId: number) {
    'use server'
    await acceptNotification(notificationId)
    revalidatePath('/notifications')
  }

  async function deleteInviteNotification(notificationId: number) {
    'use server'
    await deleteNotification(notificationId)
    revalidatePath('/notifications')
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl">Notifications</h1>
      </div>
        {
          notifications.length > 0 ? (
            <>
              {notifications.map((notification) => (
                <Notification key={notification.id} notification={notification} acceptNotification={acceptInviteNotification} deleteNotification={deleteInviteNotification} />
              ))}
            </>
          ) : (
            <>No notifications.</>
          )
        }
    </>
  )
}