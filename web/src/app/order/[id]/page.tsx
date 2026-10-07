import type { Metadata } from "next";
import { OrderView } from "@/components/order-view";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  return { title: `Order ${id} · Dum Biryani`, description: "Where your handi is right now." };
}

export default async function Page({ params }: Params) {
  const { id } = await params;
  return <OrderView id={id} />;
}
