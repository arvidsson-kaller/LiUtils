import { MetadataRoute } from "next";
import { rooms } from "@/allrooms";

const indexURL = process.env.URL || "https://www.liutils.se";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: indexURL,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: indexURL + "/login",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    ...getAllRoomSitemapEntries(),
  ];
}

const getAllRoomSitemapEntries = (): MetadataRoute.Sitemap => {
  return rooms.map((room) => {
    return {
      url: indexURL + `/room/${encodeURIComponent(room)}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    };
  });
};
