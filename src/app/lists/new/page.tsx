'use client'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import React, { FormEventHandler, MouseEventHandler, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { handler } from "tailwindcss-animate";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { list } from '@prisma/client'

export default function CreateListPage() {

  const router = useRouter();

  const [listName, setListName] = useState("");
  const [listDescription, setListDescription] = useState("");
  const [isDisabledSubmit, setIsDisabledSubmit] = useState(true);

  const mutation = useMutation({
    mutationFn: async (newList: Partial<list>) =>  {
      const promise = await fetch("/api/lists/", { method: "POST", body: JSON.stringify(newList) })
      const data = await promise.json();
      router.push(`/lists/${data.id}`);
    }
  })

  const onListNameInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const name = (e.target as HTMLInputElement).value
    if(name.length > 3) {
      setListName(name)
      setIsDisabledSubmit(false)
      return;
    }
    setIsDisabledSubmit(true);
  }

  function createList() {
    mutation.mutate({ name: listName, description: listDescription })
  }

  return (
    <main className="flex flex-col gap-8">
      <div>
        <h1 className="text-4xl">Create New List</h1>
      </div>
      <form className="flex flex-col gap-4 md:w-[50%]">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input type="text" id="name" placeholder="List name" required onInput={onListNameInput}/>
        </div>

        <div className="grid w-full gap-1.5">
          <Label htmlFor="message">Description</Label>
          <Textarea placeholder="Type your message here." id="description" onChange={(e) => setListDescription(e.target.value)}/>
        </div>

        <Button type="button" className="md:w-fit" onClick={createList} disabled={isDisabledSubmit || mutation.isPending}>
          {mutation.isPending ? 'Saving...' : 'Submit' }
        </Button>
      </form>
    </main>
  )
}