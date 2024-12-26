import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import Providers from "./lib/apollo-provider";

export const metadata: Metadata = {
  title: "Text Review"
};

export default function RootLayout({ children }: { children: ReactNode }) {

  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
