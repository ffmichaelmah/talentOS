import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TalentOS — Business tools for modern talents",
    template: "%s · TalentOS",
  },
  description:
    "Invoices, contracts, booking advances, and payment tracking for DJs, creators, performers, and the people who manage them — no agent or admin team required.",
};

// Dark is the brand default; only an explicit "light" choice opts out.
const themeInitScript = `try{if(localStorage.getItem("talentos-theme")==="light")document.documentElement.classList.remove("dark")}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {children}
      </body>
    </html>
  );
}
