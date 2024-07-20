import { db } from "@/db";
import { item } from "@prisma/client";


export async function createList(
  userId: number,
  name: string,
  description?: string,
) {
  const list = await db.list.create({
    data: {
      creatorId: userId,
      name,
      description
    }
  })
  return list;
}

export async function getListByListId(listId: number) {
  return await db.list.findFirst({
    where: {
      id: listId
    },
    include: {
      items: true,
      users: true
    }
  })
}

export async function getListsByUserId(userId: number) {
  return await db.list.findMany({
    where: {
      creatorId: userId
    }
  })
}

export async function getSharedLists(userId: number) {
  return await db.list.findMany({
    include: {
      users: {
        where: {
          id: userId
        }
      }
    }
  })
}

export async function addUserToList(userId: number, listId: number) {
  return await db.list.update({
    where: {
      id: listId
    },
    data: {
      users: {
        connect: {
          id: userId
        }
      }
    }
  })
}

export async function updateList(listId: number, name: string, description?: string) {
  return await db.list.update({
    where: {
      id: listId
    },
    data: {
      name,
      description
    }
  })
}

export async function deleteList(listId: number) {
  return await db.list.delete({ 
    where: { 
      id: listId 
    }
  })
}