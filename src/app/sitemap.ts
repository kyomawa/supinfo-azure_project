import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  return [
    {
      url: "https://supinfo-azure-project.fr/",
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://supinfo-azure-project.fr/connexion",
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];
}
