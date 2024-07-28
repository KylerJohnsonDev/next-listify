import { db } from "@/db";
import { List } from "@prisma/client";


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
  return db.list.findFirst({
    where: {
      id: listId
    },
    include: {
      items: true,
      listUsers: {
        include: {
          user: {
            include: {
              profile: true
            }
          }
        }
      }
    }
  })
}

export async function getListsByUserId(userId: number) {
  return db.list.findMany({
    where: {
      creatorId: userId
    }
  })
}

export async function getSharedLists(userId: number): Promise<List[]> {
  const listUsers = await db.listUsers.findMany({
    where: { userId },
    include: {
      list: true
    }
  })

  return listUsers.map(listUser => {
    return listUser.list
  })
}

export async function addUserToList(userId: number, listId: number) {
  const listUsers = await db.listUsers.findMany({
    where: {
      userId,
      listId
    }
  })
  if(listUsers.length > 0) {
    throw Error("User has already been added to this list")
  }
  return db.listUsers.create({
    data: {
      listId,
      userId,
    }
  })
}

export async function updateList(listId: number, name: string, description?: string) {
  return db.list.update({
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
  return db.list.delete({
    where: { 
      id: listId 
    }
  })
}