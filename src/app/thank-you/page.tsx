'use client';

import { Inter, Lora } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const lora = Lora({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-lora' });

export default function ThankYouPage() {
    // --- YOUR LINKS ARE INTEGRATED HERE ---
    const affiliateLink = "https://97391o5ztygoezeaxjw8ce3zbx.hop.clickbank.net";
    const pdfLink = "https://drive.google.com/file/d/1OCvhlcxFKVWJryy4cXVuW_XMbS1aSb-G/view?usp=sharing";

    const handleRedirect = () => {
        // Redirects to the affiliate offer
        window.location.href = affiliateLink;
    };

    const handleDownload = () => {
        // Opens the PDF in a new tab for the user to view/download
        window.open(pdfLink, '_blank');
    }

    return (
        <div className={`${inter.variable} ${lora.variable} font-sans min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4`}>
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center animate-in fade-in zoom-in-95 duration-500">
                
                <div className="mx-auto w-16 h-16 mb-6 bg-emerald-100 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className={`font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4 ${lora.className}`}>
                    Success! Here Is Your Free Guide.
                </h1>

                <p className="text-lg text-gray-600 mb-8">
                    Click the button below to instantly open your copy of "The 5 'Metabolic Master Switch' Foods".
                </p>

                {/* --- PDF Download Button --- */}
                <button
                    onClick={handleDownload}
                    className="w-full max-w-md mx-auto px-8 py-4 mb-10 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-lg shadow-lg hover:shadow-xl text-white font-bold text-lg transition-all transform hover:-translate-y-1"
                >
                    <span>Download My Guide Now</span>
                    <span>↓</span>
                </button>

                <div className="border-t border-gray-200 pt-8">
                    <p className="font-semibold text-gray-800 text-xl mb-2">Your Next Step (Highly Recommended):</p>
                    <p className="text-gray-600 mb-6">
                        The guide is a great start, but the real breakthrough came when I saw the science behind it. Click below to watch the free presentation that explains everything.
                    </p>

                    {/* --- Affiliate Link Button --- */}
                    <button
                        onClick={handleRedirect}
                        className="w-full max-w-md mx-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-lg shadow-lg hover:shadow-xl text-white font-bold text-lg transition-all transform hover:-translate-y-1"
                    >
                        <span>Watch The Free Presentation</span>
                        <span>→</span>
                    </button>
                </div>
            </div>
        </div>
    );
}