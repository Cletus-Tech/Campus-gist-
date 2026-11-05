import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Campus Gist — Everything Campus. One Platform.",
  description: "Trusted campus news, student updates and useful campus services, starting with FUTA.",
  applicationName: "Campus Gist",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
