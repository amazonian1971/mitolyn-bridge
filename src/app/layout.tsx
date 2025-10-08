import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import Providers from './providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mitolyn - Natural Metabolism Booster for Women Over 40',
  description: 'Gentle, non-stimulant metabolic support. Promote steady energy with natural ingredients. Made in USA with a 180-day guarantee.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* --- GOOGLE TAG MANAGER (HEAD) --- */}
        <Script
          id="google-tag-manager-head"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-WRKVNPSJ');
            `,
          }}
        />
        {/* --- END OF GTM (HEAD) --- */}

        {/* --- MICROSOFT CLARITY SCRIPT --- */}
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

        {/* --- TABOOLA PIXEL CODE --- */}
        <Script
          id="taboola-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window._tfa = window._tfa || [];
              window._tfa.push({notify: 'event', name: 'page_view', id: 1189206});
              !function (t, f, a, x) {
                     if (!document.getElementById(x)) {
                        t.async = 1;t.src = a;t.id=x;f.parentNode.insertBefore(t, f);
                     }
              }(document.createElement('script'),
              document.getElementsByTagName('script')[0],
              '//cdn.taboola.com/libtrc/unip/1189206/tfa.js',
              'tb_tfa_script');
            `,
          }}
        />
        {/* --- END OF TABOOLA PIXEL CODE --- */}
      </head>
      <body className={inter.className}>
        {/* --- GOOGLE TAG MANAGER (BODY - NOSCRIPT) --- */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WRKVNPSJ"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        {/* --- END OF GTM (BODY) --- */}

        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}