import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Web3 Browser",
  description: "Farcaster Mini App Browser",
  other: {
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: "https://placehold.co/600x400/1a1a1a/purple?text=Mini+App+Browser",
      button: {
        title: "Open Browser",
        action: {
          type: "launch_frame",
          name: "Web3 Browser",
          url: "https://farcast-dapp.vercel.app", // Yahan apna Vercel Link dalna baad me
          splashImageUrl: "https://placehold.co/200x200/1a1a1a/purple?text=Loading...",
          splashBackgroundColor: "#1a1a1a",
        },
      },
    }),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
