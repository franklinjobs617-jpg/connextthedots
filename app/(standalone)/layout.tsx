import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Shopping Guides",
  robots: {
    index: false,
    follow: true,
  },
};

export default function StandaloneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
