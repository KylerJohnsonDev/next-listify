import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getListsByUserId, getSharedLists } from "@/data-access/list";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default async function ListsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const userLists = await getListsByUserId(user.id)

  const sharedLists = await getSharedLists(user.id)

  return (
    <>
      <main className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl">Lists</h1>
          <Link href="/lists/new" className="bg-accent py-2 px-4 rounded">Create List</Link>
        </div>

        <section>
          <Tabs defaultValue="yourLists" className="w-full flex flex-col gap-2">
            <TabsList className="w-fit">
              <TabsTrigger value="yourLists">Your Lists</TabsTrigger>
              <TabsTrigger value="sharedLists">Shared With You</TabsTrigger>
            </TabsList>

            <TabsContent value="yourLists" className="flex flex-wrap gap-4">
              {
                userLists?.length > 0 ?
                  userLists.map((list) => (
                    <Link href={`/lists/${list.id}`} className="w-full md:w-[25%]">
                      <Card className="py-8 text-center">
                        {list.name}
                      </Card>
                    </Link>
                    )
                  ) : 'No lists found'
              }
            </TabsContent>

            <TabsContent value="sharedLists" className="flex flex-wrap gap-4">
              {
                sharedLists?.length > 0 ?
                  sharedLists.map((list) => (
                    <Link href={`/lists/${list.id}`} className="w-full md:w-[25%]">
                      <Card className="py-8 text-center">
                        {list.name}
                      </Card>
                    </Link>
                    )
                  ) : 'No lists have been shared with you.'
              }
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </>
  );
}
