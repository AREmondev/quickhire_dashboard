import type { Metadata } from "next";
import "./globals.css";
import { clashDisplay } from "@/lib/fonts";
import { Epilogue, Inter } from "next/font/google";
// Font Awesome
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

import Providers from "./providers";
config.autoAddCss = false;

export const epilogue = Epilogue({
  subsets: ["latin"],
  variable: "--font-epilogue",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "QuickHire — Find Your Dream Job",
    template: "%s | QuickHire",
  },
  description:
    "QuickHire is the best platform for job seekers passionate about startups. Discover thousands of jobs, build your resume, and apply with ease.",
  keywords: [
    "jobs",
    "job search",
    "career",
    "startup jobs",
    "remote jobs",
    "hiring",
  ],
  openGraph: {
    title: "QuickHire — Find Your Dream Job",
    description:
      "Discover more than 5000+ jobs across design, technology, marketing, and more.",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${clashDisplay.variable} ${epilogue.variable} ${inter.variable} antialiased bg-white w-full overflow-x-hidden`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
