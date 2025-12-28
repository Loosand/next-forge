"use server";

import { auth } from "@repo/auth/server";
import { database, ilike, user } from "@repo/database";
import Fuse from "fuse.js";
import { headers } from "next/headers";

export const searchUsers = async (
  query: string
): Promise<
  | {
      data: string[];
    }
  | {
      error: unknown;
    }
> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Not logged in");
    }

    // Search users in database
    const users = await database
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      })
      .from(user)
      .where(ilike(user.name, `%${query}%`));

    const fuse = new Fuse(users, {
      keys: ["name", "email"],
      minMatchCharLength: 1,
      threshold: 0.3,
    });

    const results = fuse.search(query);
    const data = results.map((result) => result.item.id);

    return { data };
  } catch (error) {
    return { error };
  }
};
