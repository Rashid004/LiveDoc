/** @format */

import CollaborativeRoom from "@/components/CollaborativeRoom";
import { getDocument } from "@/lib/actions/room.actions";
import { getClerkUsers } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Document = async ({ params: { id } }: SearchParamProps) => {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/sign-in");
    return null; // Prevent further execution after redirect
  }

  const userEmail = clerkUser.emailAddresses?.[0]?.emailAddress;

  if (!userEmail) {
    console.error("Current user email address not found");
    redirect("/");
    return null; // Prevent further execution after redirect
  }

  const room = await getDocument({
    roomId: id,
    userId: userEmail,
  });

  if (!room) {
    console.error("Room not found or access denied");
    redirect("/");
    return null; // Prevent further execution after redirect
  }

  const userIds = Object.keys(room.usersAccesses || {});
  const users = await getClerkUsers({ userIds });

  const usersData = users.map((user: User) => ({
    ...user,
    userType: room.usersAccesses[user?.email]?.includes("room:write")
      ? "editor"
      : "viewer",
  }));

  const currentUserType = room.usersAccesses[userEmail]?.includes("room:write")
    ? "editor"
    : "viewer";

  return (
    <main className="flex w-full flex-col items-center">
      <CollaborativeRoom
        roomId={id}
        roomMetadata={room.metadata}
        users={usersData}
        currentUserType={currentUserType}
      />
    </main>
  );
};

export default Document;
