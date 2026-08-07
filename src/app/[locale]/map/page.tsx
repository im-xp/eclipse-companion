import type { Metadata } from "next";
import { MapSwitcher } from "@/components/MapSwitcher";
import { asLocale, getDict } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return { title: getDict(asLocale((await params).locale)).map.metaTitle };
}

export default async function MapPage({ params }: PageProps) {
  const dict = getDict(asLocale((await params).locale));
  return (
    <div className="fixed inset-x-0 top-16 bottom-[calc(3.75rem+env(safe-area-inset-bottom))] overflow-hidden bg-eclipse-black">
      <MapSwitcher
        maps={[
          {
            id: "festival",
            label: dict.map.festival,
            src: "/festival-map.jpg",
            width: 1800,
            height: 2400,
          },
          {
            id: "campground",
            label: dict.map.campground,
            src: "/campground-map.jpg",
            width: 1800,
            height: 2400,
          },
        ]}
      />
    </div>
  );
}
