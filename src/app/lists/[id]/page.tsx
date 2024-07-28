import { getListByListId, updateList } from "@/data-access/list";
import React from "react";
import { ListDetailsForm } from "@/app/lists/[id]/list-details-form";
import { revalidatePath } from "next/cache";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ItemList } from "@/app/lists/[id]/item-list";
import { toggleItemComplete } from "@/data-access/item";
import CollaboratorForm from "@/app/lists/[id]/collaborator-form";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { createAddCollaboratorNotification } from "@/data-access/notifications";

type ListDetailsPageParams = {
  params: {
    id: number
  }
}

export default async function ListDetailPage({  params: { id } }: ListDetailsPageParams) {

  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const list = await getListByListId(Number(id));

  async function updateListDetails(id: number, name: string, description: string) {
    'use server'
    await updateList(id, name, description)
    revalidatePath(`/list/${id}`)
  }

  async function toggleComplete(id: number, isComplete: boolean) {
    'use server'
    await toggleItemComplete(id, isComplete)
    revalidatePath(`/list/${id}`)
  }

  async function addCollaborator(emailAddress: string) {
    'use server'
    await createAddCollaboratorNotification(emailAddress, user!.id, Number(id))
    revalidatePath(`/list/${id}`);
  }

  if(!list) {
    return (
      <>
        Could not find list.
      </>
    )
  }

  const collaborators = list?.listUsers.map(listUser => listUser.user)

  return (
    <>
      <header className="mb-8">
        <h1 className="text-4xl">Manage List</h1>
      </header>

      {
        list ? (
          <main className="flex flex-col gap-4 md:flex-row">
            <div id="col-1" className="flex flex-col gap-4 min-w-[33%]">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">List Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <ListDetailsForm id={list.id} name={list.name} description={list.description} updateListDetails={updateListDetails} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Collaborators</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  {
                    collaborators.length > 0 ? (
                      <>
                        { collaborators.map(user => (
                          <span key={user.email}>{ user.profile[0].displayName ?? user.email }</span>
                        ))}
                      </>
                    ) : (
                      <span>No collaborators have been added to this list.</span>
                    )
                  }
                  <CollaboratorForm addCollaborator={addCollaborator} />
                </CardContent>
              </Card>
            </div>

            <Card className="grow h-fit">
              <CardHeader>
                <CardTitle className="text-2xl">List Items</CardTitle>
              </CardHeader>
              <CardContent>
                <ItemList items={list.items} listId={list.id} toggleItemComplete={toggleComplete}  />
              </CardContent>
            </Card>

          </main>
        ) : (
          <>
            <p>Unable to load list.</p>
          </>
        )
      }
    </>
  )
}