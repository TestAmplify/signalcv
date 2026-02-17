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
  metadataBase: new URL("https://signalcv.testamplify.com"),
  title: {
    default: "SignalCV",
    template: "%s · SignalCV",
  },
  description:
    "SignalCV is a resume tailoring automation engine with ATS scoring, cover letters, and recruiter DMs.",
  openGraph: {
    title: "SignalCV",
    description:
      "Automate resume tailoring: paste a job description and ship ATS-safe tailored resumes, cover letters, and recruiter DMs.",
    url: "https://signalcv.testamplify.com",
    siteName: "SignalCV",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "SignalCV · Resume Tailoring Automation Engine",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SignalCV",
    description:
      "Resume tailoring automation with ATS scoring and application tracking.",
    images: ["/twitter-image"],
    site: "@signalcv",
  },
  themeColor: "#0B0C0F",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
