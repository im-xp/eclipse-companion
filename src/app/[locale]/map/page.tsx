import type { Metadata } from "next";
import { MapViewer } from "@/components/MapViewer";
import { asLocale, getDict } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return { title: getDict(asLocale((await params).locale)).map.metaTitle };
}

export default function MapPage() {
  return (
    <div className="fixed inset-x-0 top-16 bottom-[calc(3.75rem+env(safe-area-inset-bottom))] overflow-hidden bg-eclipse-black">
      <MapViewer src="/festival-map.jpg" width={1501} height={2000} />
    </div>
  );
}
