import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import Providers from "./lib/apollo-provider";
import TopMenu from "@/components/top-menu/TopMenu";
import Footer from "@/components/footer/Footer";

export const metadata: Metadata = {
  keywords: [ "comments", "document analysis", "highlighting", "official texts", "text analysis", "text review" ],
  title: {
    default: "Text Review",
    template: "%s | Text Review"
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {

    return (
        <html className="h-full" lang="en">
            <body className="flex flex-col min-h-screen">
                <Providers>
                    <header>
                        <TopMenu />
                    </header>
                    <main className="flex-1">
                        {children}
                    </main>
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}
