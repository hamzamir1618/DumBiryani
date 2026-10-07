import type { Metadata } from "next";
import { MenuView } from "@/components/menu-view";

export const metadata: Metadata = {
  title: "Menu · Dum Biryani",
  description: "Five biryanis, sides, sweets and chai. Each handi is sealed when you order it.",
};

export default function Page() {
  return <MenuView />;
}
