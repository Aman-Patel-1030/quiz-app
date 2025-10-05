import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Background3D from "./components/Background3D";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quiz Challenge - Test Your Knowledge",
  description: "Take an interactive quiz with 15 questions in 30 minutes. Test your knowledge across various categories and get instant results.",
  keywords: ["quiz", "trivia", "test", "knowledge", "education", "learning"],
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
        <Background3D />
        {children}
      </body>
    </html>
  );
}
