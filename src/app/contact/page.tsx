import React from 'react';
import Link from 'next/link';

// --- Icon Components for a professional touch ---

const EnvelopeIcon = () => (
  <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const QuestionIcon = () => (
    <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const LightBulbIcon = () => (
    <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);

const WrenchIcon = () => (
    <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);


export default function ContactUsPage() {
  const brandName = "Mitolyn"; // Use a variable for easy updates
  const contactEmail = "contact@mitolyn.com"; // Your actual contact email

  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      {/* Main content card for a clean, focused look */}
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-lg shadow-md">
        
        <Link href="/" className="inline-block mb-8 text-emerald-600 hover:text-emerald-800 transition-colors">
          &larr; Back to Home
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-lg text-gray-600 mb-10">
          We’re always happy to hear from you. Whether you have a question, feedback, or need assistance, 
          our team is here to help.
        </p>

        {/* Primary Contact Method Card */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mb-12 flex items-center gap-6">
          <div className="flex-shrink-0">
            <EnvelopeIcon />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Get in Touch by Email</h2>
            <p className="text-gray-600 mb-2">For the quickest response, please send us an email.</p>
            <a 
              href={`mailto:${contactEmail}`} 
              className="text-2xl font-bold text-emerald-700 hover:text-emerald-900 transition-colors"
            >
              {contactEmail}
            </a>
          </div>
        </div>

        {/* Reasons to Contact Section */}
        <h2 className="text-3xl font-bold text-gray-900 mb-8">What can we help you with?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Item 1: Product Questions */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 pt-1"><QuestionIcon /></div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Product Questions</h3>
              <p className="text-gray-600">Have a question about {brandName}, its ingredients, or how it works? We’re happy to provide the information you need.</p>
            </div>
          </div>

          {/* Item 2: Feedback & Suggestions */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 pt-1"><LightBulbIcon /></div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Feedback & Suggestions</h3>
              <p className="text-gray-600">Your ideas and feedback are invaluable. Let us know how we can improve our product or website experience for you.</p>
            </div>
          </div>

          {/* Item 3: Technical Support */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 pt-1"><WrenchIcon /></div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Technical Support</h3>
              <p className="text-gray-600">Encountering an issue on our site? Please report any bugs or errors so we can resolve them quickly.</p>
            </div>
          </div>

        </div>

        <div className="mt-12 border-t pt-8 text-center text-gray-500">
          <p>We typically respond within 24-48 business hours. Thank you for being a part of our community!</p>
        </div>

      </div>
    </main>
  );
}