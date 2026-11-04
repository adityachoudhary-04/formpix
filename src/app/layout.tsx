import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider } from "@/components/layout/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    template: "%s | SarkariPhoto - Free Exam Photo & Signature Resizer",
    default: "SarkariPhoto - Free Exam Photo & Signature Resizer",
  },
  description:
    "Free online tool to resize, crop, and compress passport photos and signatures for government exam applications like UPSC, SSC, Banking, Railway, and more. No upload needed — 100% browser-based and private.",
  keywords: [
    "passport photo resizer",
    "signature resizer",
    "exam photo tool",
    "sarkari exam photo",
    "UPSC photo resize",
    "SSC photo resize",
    "government exam photo",
    "photo compressor",
    "signature compressor",
    "online photo editor",
  ],
  authors: [{ name: "SarkariPhoto" }],
  creator: "SarkariPhoto",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://sarkariphoto.com"
  ),
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "SarkariPhoto",
    title: "SarkariPhoto - Free Exam Photo & Signature Resizer",
    description:
      "Free online tool to resize, crop, and compress passport photos and signatures for government exam applications. 100% browser-based and private.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SarkariPhoto - Free Exam Photo & Signature Resizer",
    description:
      "Free online tool to resize, crop, and compress passport photos and signatures for government exam applications. 100% browser-based and private.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Inline script to prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('sarkariphoto-theme');
                  var resolved = theme;
                  if (!theme || theme === 'system') {
                    resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  document.documentElement.classList.add(resolved);
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
