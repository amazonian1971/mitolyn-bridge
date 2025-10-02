// app/disclaimer/page.tsx
export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Affiliate & Product Disclaimer</h1>
        
        <div className="prose prose-gray space-y-6 text-gray-700">
          <h2 className="text-xl font-semibold text-gray-900">1. Affiliate Disclosure</h2>
          <p>
            MetabolismSupport.com is a participant in affiliate advertising programs. This means we may earn commissions on qualifying purchases made through our links at <strong>no extra cost to you</strong>. We only promote products we believe support natural wellness.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">2. Product Disclaimer</h2>
          <p>Mitolyn is a dietary supplement. The following statements have not been evaluated by the Food and Drug Administration (FDA). This product is not intended to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Diagnose, treat, cure, or prevent any disease</li>
            <li>Replace medical advice from a licensed healthcare provider</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900">3. Results May Vary</h2>
          <p>Individual experiences with dietary supplements vary widely. There are no guaranteed results. Always consult your physician before starting any new supplement, especially if you are pregnant, nursing, or taking medication.</p>

          <h2 className="text-xl font-semibold text-gray-900">4. No Medical Claims</h2>
          <p>We do not claim that Mitolyn causes weight loss, burns fat, or targets specific body areas. Our content is for informational purposes only and reflects personal wellness journeys, not clinical outcomes.</p>

          <h2 className="text-xl font-semibold text-gray-900">5. Accuracy of Information</h2>
          <p>While we strive for accuracy, product formulations and policies may change. Please refer to the official Mitolyn website for the most current information.</p>

          <p className="mt-8 pt-6 border-t border-gray-200">
            For questions about this disclaimer, contact:{" "}
            <a href="mailto:legal@metabolismsupport.com" className="text-blue-600 hover:underline">
              legal@metabolismsupport.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}