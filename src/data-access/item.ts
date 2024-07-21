import { db } from "@/db";


export async function createItem(listId: number, text: string) {
  return db.item.create({
    data: {
      listId,
      text,
    }
  });
}

export async function toggleItemComplete(itemId: number, isComplete: boolean) {
  return db.item.update({
    where: {
      id: itemId,
    },
    data: {
      isComplete,
    }
  });
}

export async function deleteItem(itemId: number) {
  await db.item.delete({
    where: {
      id: itemId
    }
  })
}