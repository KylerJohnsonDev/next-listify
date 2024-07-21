import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createList } from "@/data-access/list";

export async function POST(request: Request): Promise<Response> {

  const { session } = await validateRequest();
  if (!session) {
    redirect("/sign-in");
  }

  const body = await request.json()
  const listName = body.name
  const listDescription = body.description

  const newList = await createList(session.userId, listName, listDescription)
  return Response.json(newList)
}