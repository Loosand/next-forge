import { asset, database, desc, type task } from "@repo/database";
import { buildUrl } from "@repo/storage";
import { AssetGrid } from "./asset-detail-dialog";

const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_URL ?? "";

function toAssetItem(
  a: typeof asset.$inferSelect & {
    taskRun: typeof task.$inferSelect | null;
  }
) {
  const meta = a.metadata as Record<string, unknown> | null;
  const payload = a.taskRun?.payload as Record<string, unknown> | null;
  const input = payload?.input as Record<string, unknown> | null;

  return {
    id: a.id,
    url: buildUrl(a.storageKey, R2_PUBLIC_URL),
    mediaType: a.mediaType,
    prompt: (input?.prompt as string) ?? null,
    model: a.taskRun?.model ?? null,
    width: (meta?.width as number) ?? null,
    height: (meta?.height as number) ?? null,
    duration: (meta?.duration as number) ?? null,
    createdAt: a.createdAt.toLocaleString(),
  };
}

export type AssetItem = ReturnType<typeof toAssetItem>;

const Page = async () => {
  const assets = await database.query.asset.findMany({
    orderBy: desc(asset.createdAt),
    with: { taskRun: true },
  });

  const items = assets.map(toAssetItem);

  return (
    <div className="space-y-4 p-6">
      <h1 className="font-bold text-2xl">Assets</h1>

      {items.length === 0 ? (
        <p className="text-muted-foreground">No assets yet.</p>
      ) : (
        <AssetGrid assets={items} />
      )}
    </div>
  );
};

export default Page;
