import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DishView } from "@/components/dish-view";
import { byId, dishes } from "@/data/menu";

export function generateStaticParams() {
  return dishes.map((dish) => ({ id: dish.id }));
}

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const dish = byId(id);
  return {
    title: dish ? `${dish.name} · Dum Biryani` : "Dum Biryani",
    description: dish?.description,
  };
}

export default async function Page({ params }: Params) {
  const { id } = await params;
  const dish = byId(id);
  if (!dish) notFound();
  return <DishView dish={dish} />;
}
