import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Digital Bar",
    short_name: "Digital Bar",
    description:
      "Carta digital para restaurantes",
    start_url: "/",
    display: "standalone",
    background_color: "#fffbeb",
    theme_color: "#d97706",
    orientation: "portrait",
    lang: "es",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}