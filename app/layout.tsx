import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";
import "@/lib/zod/extensions"
import { ReactNode } from "react";
import Providers from "@/lib/apollo-client/apollo-provider";
import TopMenu from "@/components/top-menu/TopMenu";
import Footer from "@/components/footer/Footer";

const sourceSans3 = Source_Sans_3({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-source-sans-3',
    weight: ['200', '300', '400', '500', '600', '700', '800', '900']
})

export const metadata: Metadata = {
  keywords: [ "comments", "document analysis", "highlighting", "interpretation", "official texts", "text analysis", "text review" ],
  title: {
    default: "Text Review",
    template: "%s | Text Review"
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {

    return (
        <html className={`h-full ${sourceSans3.variable}`} lang="en">
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
