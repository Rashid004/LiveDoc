/** @format */

import CollabrativeRoom from "@/components/CollaborativeRoom";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Documents = async () => {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  return (
    <main className="flex w-full flex-col items-center gap-2">
      <CollabrativeRoom />
    </main>
  );
};

export default Documents;
