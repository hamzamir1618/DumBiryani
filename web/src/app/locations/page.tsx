import type { Metadata } from "next";
import { LocationsView } from "@/components/locations-view";

export const metadata: Metadata = {
  title: "Locations · Dum Biryani",
  description: "Four rooms across Karachi, Lahore and Islamabad. Book a table or collect.",
};

export default function Page() {
  return <LocationsView />;
}
