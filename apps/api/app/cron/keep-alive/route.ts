import { database, eq, page } from "@repo/database";

export const GET = async () => {
  const [newPage] = await database
    .insert(page)
    .values({ name: "cron-temp" })
    .returning();

  await database.delete(page).where(eq(page.id, newPage.id));

  return new Response("OK", { status: 200 });
};
