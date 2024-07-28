import { Item } from "@prisma/client";
import { ListItem } from "@/components/list-item";
import React from "react";
import { AddItemForm } from "@/app/lists/[id]/add-item-form";
import { createItem, deleteItem } from "@/data-access/item";
import { revalidatePath } from "next/cache";

type ItemListProps = {
  listId: number;
  items: Item[]
  toggleItemComplete: (listId: number, isComplete: boolean) => Promise<void>
}

export function ItemList({ listId, items, toggleItemComplete }: ItemListProps) {

  async function addNewItem(listId: number, text: string) {
    'use server'
    await createItem(listId, text)
    revalidatePath(`/list/${listId}`)
  }

  async function deleteListItem(itemId: number) {
    'use server'
    await deleteItem(itemId);
    revalidatePath(`/list/${listId}`)
  }

  return (
    <>
      <section className="flex flex-col gap-4 mb-8">
      {
        items?.length > 0 ?
          items.map(item => ((
              <ListItem key={item.id} item={item} toggleComplete={toggleItemComplete} deleteItem={deleteListItem} />
            ))
          ):
          <p>No list items have been added.</p>
      }
      </section>
      <AddItemForm listId={listId} addNewItem={addNewItem} />
    </>
  )
}