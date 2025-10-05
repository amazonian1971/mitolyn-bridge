// src/app/layout.tsx
import { Providers } from "./providers";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Natural Metabolism Support for Women Over 40 | MetabolismSupport.com",
  description: "Discover gentle, natural metabolic support to help you feel energized after 40. Non-stimulant, made in USA, 60-day guarantee.",
  keywords: "natural metabolism support, metabolism booster for women, energy supplement after 40, non stimulant metabolism support, healthy metabolic function",
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
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

        {/* Google Ads Global Site Tag */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-968379698"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-968379698');
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}