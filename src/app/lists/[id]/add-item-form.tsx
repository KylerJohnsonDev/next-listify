'use client'

import React, { createRef, RefObject, useRef, useState } from "react";
import { Input } from "@/components/ui/input";

type AddItemFormProps = {
  listId: number;
  addNewItem: (listId: number, text: string) => Promise<void>
}

export function AddItemForm({ listId, addNewItem}: AddItemFormProps) {

  const inputRef: RefObject<HTMLInputElement>  = createRef()

  async function onKeydown(e: React.KeyboardEvent<HTMLInputElement>) {
    const inputEl = e.target as HTMLInputElement;
    const text = inputEl.value;
    if(e.key === "Enter" && text.length > 0) {
      if(inputRef.current) inputRef.current.value = ''
      await addNewItem(listId, text)
    }
  }

  return (
    <>
      <Input placeholder="Enter item and press enter.." onKeyDown={onKeydown} ref={inputRef}/>
    </>
  )
}