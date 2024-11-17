import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Supinfo Azure Project",
    short_name: "SAP",
    description:
      "Supinfo Azure Project, la nouvelle plateforme sociale qui connecte les esprits créatifs. Rejoignez notre réseau social innovant dès aujourd'hui.",
    start_url: "/",
    display: "standalone",
    background_color: "#b21e4b",
    theme_color: "#fafafa",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-192x192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
      {
        src: "/icons/icon-512x512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
      },
    ],
  };
}
