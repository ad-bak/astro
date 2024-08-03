import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";

export const GET: APIRoute = async ({ url }): Promise<Response> => {
  const query: string | null = url.searchParams.get("q");

  if (!query) {
    return new Response("No query provided", { status: 400 });
  }

  const allBlogArticles: CollectionEntry<"blog">[] = await getCollection("blog");

  const searchResults = allBlogArticles.filter((article) => {
    const titleMatch: boolean = article.data.title.toLocaleLowerCase().includes(query?.toLocaleLowerCase() ?? "");

    const bodyaMatch: boolean = article.body.toLocaleLowerCase().includes(query?.toLocaleLowerCase() ?? "");

    const slugMatch = article.slug.toLocaleLowerCase().includes(query?.toLocaleLowerCase() ?? "");

    return titleMatch || bodyaMatch || slugMatch;
  });

  return new Response(JSON.stringify(searchResults), {
    status: 200,

    headers: {
      "Content-Type": "application/json",
    },
  });
};
