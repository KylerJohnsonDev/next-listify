'use client'

import React, { createRef, RefObject } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export type CollaboratorFormProps = {
  addCollaborator: (emailAddress: string) => Promise<void>
}

export default function CollaboratorForm({ addCollaborator }: CollaboratorFormProps) {

  const inputRef: RefObject<HTMLInputElement>  = createRef()

  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    const emailAddress = inputRef.current?.value ?? ''
    if(emailAddress.length > 0) {
      if(inputRef.current) inputRef.current.value = ''
      try {
        await addCollaborator(emailAddress)
        toast({ description: 'Invitation sent!' })
      } catch (error) {
        toast({ description: `Invitation failed. ${error}`, className: "bg-destructive" })
      }
    }
  }

  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input type="email" placeholder="Email" ref={inputRef} />
      <Button type="button" onClick={(e) => handleSubmit(e)}>Add</Button>
    </div>
  )
}