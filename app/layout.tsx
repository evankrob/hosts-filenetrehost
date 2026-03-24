import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "What You Missed — Weekly Newsletter for Real People",
  description: "A friendly weekly newsletter that explains what happened in the world in plain, simple English. No jargon. No tech-speak. Just the stories that matter, explained like a letter from a smart friend.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
