import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Campus Gist — Everything Campus. One Platform.",
  description: "Campus news, student community, accommodation, campus power updates and more.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
