import { db } from "@/db";


export async function createItem(listId: number, text: string) {
  return await db.item.create({
    data: {
      listId,
      text,
    }
  })
}

export async function deleteItem(itemId: number) {
  await db.item.delete({
    where: {
      id: itemId
    }
  })
}