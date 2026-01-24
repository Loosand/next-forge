import { database, ilike, page } from "@repo/database";
import { redirect } from "next/navigation";
import { Header } from "../_components/header";

type SearchPageProperties = {
  readonly params: Promise<{ locale: string }>;
  searchParams: Promise<{
    q: string;
  }>;
};

export const generateMetadata = async ({
  searchParams,
}: SearchPageProperties) => {
  const { q } = await searchParams;

  return {
    title: `${q} - Search results`,
    description: `Search results for ${q}`,
  };
};

const SearchPage = async ({ params, searchParams }: SearchPageProperties) => {
  const { q } = await searchParams;

  if (!q) {
    redirect("/");
  }

  const pages = await database
    .select()
    .from(page)
    .where(ilike(page.name, `%${q}%`));

  return (
    <>
      <Header page="Search" pages={["Building Your Application"]} />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          {pages.map((p) => (
            <div className="aspect-video rounded-xl bg-muted/50" key={p.id}>
              {p.name}
            </div>
          ))}
        </div>
        <div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      </div>
    </>
  );
};

export default SearchPage;
