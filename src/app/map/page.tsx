import type { Metadata } from "next";
import { MapViewer } from "@/components/MapViewer";

export const metadata: Metadata = {
  title: "Festival Map — Iceland Eclipse",
};

export default function MapPage() {
  return (
    <div className="fixed inset-x-0 top-16 bottom-[calc(3.75rem+env(safe-area-inset-bottom))] overflow-hidden bg-eclipse-black">
      <MapViewer src="/festival-map.jpg" width={1501} height={2000} />
    </div>
  );
}
