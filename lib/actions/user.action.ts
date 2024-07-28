/** @format */

"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { parseStringify } from "../utils";
import { liveblocks } from "../liveblocks";

export const getClerkUsers = async ({ userIds }: { userIds: string[] }) => {
  try {
    const { data } = await clerkClient.users.getUserList({
      emailAddress: userIds,
    });

    const users = data.map((user) => {
      const email = user.emailAddresses?.[0]?.emailAddress || "No Email";
      return {
        id: user.id,
        name: `${user.firstName ?? ""} ${user.lastName ?? ""}`,
        email,
        avatar: user.imageUrl,
      };
    });

    const sortedUsers = userIds.map(
      (email) => users.find((user) => user.email === email) || null
    );

    return parseStringify(sortedUsers);
  } catch (error) {
    console.log(`Error fetching users: ${error}`);
  }
};
