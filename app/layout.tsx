import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://staybid.com"),
  title: {
    default: "StayBid – Post Your Trip, Get Offers from Vacation Rental Hosts",
    template: "%s | StayBid",
  },
  description:
    "StayBid flips the vacation rental model. Travelers post where they want to go, their dates, group size, and wishlist amenities — then local Airbnb and vacation rental hosts compete to win their booking with custom offers.",
  keywords: [
    "vacation rental marketplace",
    "reverse airbnb",
    "travel rental offers",
    "post trip request",
    "vacation home deals",
    "rental host marketplace",
    "hipcamp alternative",
    "group travel rentals",
  ],
  authors: [{ name: "StayBid" }],
  creator: "StayBid",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://staybid.com",
    siteName: "StayBid",
    title: "StayBid – Post Your Trip, Get Offers from Vacation Rental Hosts",
    description:
      "Post your travel dates and wishlist. Let vacation rental owners come to you with their best deals.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "StayBid – The Reverse Vacation Rental Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StayBid – Hosts Compete for Your Vacation",
    description:
      "Post your trip. Get offers. Choose the best deal. The smarter way to book your next vacation rental.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://staybid.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "StayBid",
              url: "https://staybid.com",
              description:
                "Reverse vacation rental marketplace where travelers post trip requests and hosts make offers.",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://staybid.com/browse?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className="antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
