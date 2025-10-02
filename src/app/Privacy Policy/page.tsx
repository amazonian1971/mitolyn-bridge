// app/privacy/page.tsx
export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-gray space-y-6 text-gray-700">
          <p><strong>Last updated:</strong> June 2024</p>

          <p>Welcome to MetabolismSupport.com. We respect your privacy and are committed to protecting your personal data.</p>

          <h2 className="text-xl font-semibold text-gray-900">1. Information We Collect</h2>
          <p>When you click "Continue with Google," we collect:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Your name and email address (provided by Google)</li>
            <li>UTM parameters (e.g., utm_source, utm_medium) from the URL to track ad performance</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900">2. How We Use Your Information</h2>
          <p>We use your data solely to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Log qualified leads for our affiliate partner</li>
            <li>Measure the effectiveness of our advertising campaigns</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900">3. Data Sharing</h2>
          <p>We share your email and campaign data <strong>only</strong> with our trusted affiliate partner (the seller of Mitolyn) to fulfill your request. We do not sell your data to third parties.</p>

          <h2 className="text-xl font-semibold text-gray-900">4. Data Retention</h2>
          <p>Lead data is stored securely for 90 days for reporting purposes, then anonymized.</p>

          <h2 className="text-xl font-semibold text-gray-900">5. Your Rights</h2>
          <p>You may request deletion of your data by contacting us at <a href="mailto:privacy@metabolismsupport.com" className="text-blue-600 hover:underline">privacy@metabolismsupport.com</a>.</p>

          <h2 className="text-xl font-semibold text-gray-900">6. Cookies</h2>
          <p>We use essential cookies to maintain your session. We do not use tracking cookies for advertising.</p>

          <h2 className="text-xl font-semibold text-gray-900">7. Changes to This Policy</h2>
          <p>We may update this policy. The latest version will always be posted here.</p>

          <p className="mt-8 pt-6 border-t border-gray-200">
            Questions? Contact us at:{" "}
            <a href="mailto:privacy@metabolismsupport.com" className="text-blue-600 hover:underline">
              privacy@metabolismsupport.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}