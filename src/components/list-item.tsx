"use client"

import { item } from "@prisma/client";
import { Button } from "@/components/ui/button";

type ListItemProps = {
  item: item;
  toggleComplete: (id: number, isComplete: boolean) => Promise<void>;
  deleteItem: (itemId: number) => Promise<void>;
}

export function ListItem ({ item, toggleComplete, deleteItem }: ListItemProps) {

  async function handleClick(item: item) {
    await toggleComplete(item.id, !item.isComplete)
  }

  async function handleDelete(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    await deleteItem(item.id);
  }

  return (
    <div className="flex justify-between items-center py-4 border-b-[1px]" onClick={() => handleClick(item)}>
      <span className={item.isComplete ? 'line-through' : ''}>{item.text}</span>
      <Button variant="destructive" className="opacity-70" type="button" onClick={(e) => handleDelete(e)}>Delete</Button>
    </div>
  )
}