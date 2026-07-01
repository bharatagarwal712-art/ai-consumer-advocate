import "./globals.css";
import { Metadata, Viewport } from "next";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Rant-X — Turn Frustrations Into Powerful Tweets",
  description:
    "AI-powered consumer complaint assistant. Describe your issue and get a perfectly crafted complaint tweet in seconds.",
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-mesh min-h-dvh">
        {/* Floating decorative dots */}
        <div className="floating-dot" aria-hidden="true" />
        <div className="floating-dot" aria-hidden="true" />
        <div className="floating-dot" aria-hidden="true" />
        <div className="floating-dot" aria-hidden="true" />
        <div className="floating-dot" aria-hidden="true" />

        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
