import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script'; // Import the Script component
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mitolyn - Natural Metabolism Booster for Women Over 40',
  description: 'Gentle, non-stimulant metabolic support. Promote steady energy with natural ingredients. Made in USA with a 60-day guarantee.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* --- YOUR MICROSOFT CLARITY SCRIPT GOES HERE --- */}
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "tlswfo44w5");
            `,
          }}
        />
        {/* --- END OF CLARITY SCRIPT --- */}
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}