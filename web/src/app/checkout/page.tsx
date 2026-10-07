import type { Metadata } from "next";
import { CheckoutView } from "@/components/checkout-view";

export const metadata: Metadata = {
  title: "Checkout · Dum Biryani",
  description: "Delivery or collection, a time, and the handi is sealed.",
};

export default function Page() {
  return <CheckoutView />;
}
