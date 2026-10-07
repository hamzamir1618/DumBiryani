import type { Metadata } from "next";
import { BasketView } from "@/components/basket-view";

export const metadata: Metadata = {
  title: "Basket · Dum Biryani",
  description: "What you have ordered so far.",
};

export default function Page() {
  return <BasketView />;
}
