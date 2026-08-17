import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidgetGate from "@/components/ChatWidgetGate";
import { getProfile } from "@/lib/data/profile";
import "./globals.css";

export const dynamic = "force-dynamic";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Khidir — Portfolio",
  description: "Applied AI student building agentic systems, chatbots, and automation.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const profile = await getProfile();
  return (
    <html
      lang="en"
      className={`${fredoka.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer profile={profile} />
        <ChatWidgetGate />
      </body>
    </html>
  );
}
