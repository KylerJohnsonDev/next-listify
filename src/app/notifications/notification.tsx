'use client'

import { Button } from "@/components/ui/button";
import { Check, Trash2 } from "lucide-react";
import type { Notification } from '@prisma/client'
import { Card, CardContent } from "@/components/ui/card";

export type NotificationProps = {
  notification: Notification;
  acceptNotification: (notificationId: number) => Promise<void>;
  deleteNotification: (notificationId: number) => Promise<void>;
}

export default function Notification({ notification, acceptNotification, deleteNotification }: NotificationProps) {

  return (
    <Card>
      <CardContent className="flex justify-between items-center p-4 border-b-[1px]">
        <span>{notification.message}</span>
        <div className="flex gap-4">
          <Button  className="opacity-70" type="button" onClick={() => acceptNotification(notification.id)}>
            <Check />
          </Button>
          <Button variant="destructive" className="opacity-70" type="button" onClick={() => deleteNotification(notification.id)}>
            <Trash2 />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}