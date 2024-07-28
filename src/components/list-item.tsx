"use client"

import { Item } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

type ListItemProps = {
  item: Item;
  toggleComplete: (id: number, isComplete: boolean) => Promise<void>;
  deleteItem: (itemId: number) => Promise<void>;
}

export function ListItem ({ item, toggleComplete, deleteItem }: ListItemProps) {

  async function handleClick(item: Item) {
    await toggleComplete(item.id, !item.isComplete)
  }

  async function handleDelete(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    await deleteItem(item.id);
  }

  return (
    <div className="flex justify-between items-center py-2 border-b-[1px]" onClick={() => handleClick(item)}>
      <span className={item.isComplete ? 'line-through opacity-30' : ''}>{item.text}</span>
      <Button variant="destructive" className="opacity-70" type="button" onClick={(e) => handleDelete(e)}>
        <Trash2 />
      </Button>
    </div>
  )
}