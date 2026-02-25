import { type asset, database, desc, task } from "@repo/database";
import { buildUrl } from "@repo/storage";
import { TaskTable } from "./task-detail-dialog";

const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_URL ?? "";

function toTaskItem(
  t: typeof task.$inferSelect & {
    assets: (typeof asset.$inferSelect)[];
  }
) {
  const payload = t.payload as Record<string, unknown> | null;
  const input = payload?.input as Record<string, unknown> | null;

  return {
    id: t.id,
    model: t.model ?? null,
    status: t.status,
    prompt: (input?.prompt as string) ?? null,
    triggerRunId: t.triggerRunId ?? null,
    assetsCount: t.assets.length,
    assets: t.assets.map((a) => ({
      id: a.id,
      url: buildUrl(a.storageKey, R2_PUBLIC_URL),
      mediaType: a.mediaType,
      storageKey: a.storageKey,
    })),
    response: t.response ? JSON.stringify(t.response, null, 2) : null,
    createdAt: t.createdAt.toLocaleString(),
    updatedAt: t.updatedAt.toLocaleString(),
  };
}

export type TaskItem = ReturnType<typeof toTaskItem>;

const Page = async () => {
  const tasks = await database.query.task.findMany({
    orderBy: desc(task.createdAt),
    with: { assets: true },
  });

  const items = tasks.map(toTaskItem);

  return (
    <div className="space-y-4 p-6">
      <h1 className="font-bold text-2xl">Tasks</h1>

      {items.length === 0 ? (
        <p className="text-muted-foreground">No tasks yet.</p>
      ) : (
        <TaskTable tasks={items} />
      )}
    </div>
  );
};

export default Page;
