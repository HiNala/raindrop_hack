export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold">Privacy Policy</h1>

        <div className="prose prose-invert max-w-none">
          <p className="text-text-muted">Last updated: {new Date().toLocaleDateString()}</p>

          <h2>1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you create an account,
            use our services, or contact us.
          </p>

          <h3>Personal Information</h3>
          <ul>
            <li>Name and email address</li>
            <li>Profile information (username, bio, avatar)</li>
            <li>Payment information (processed through secure third parties)</li>
            <li>Content you create and publish</li>
          </ul>

          <h3>Usage Information</h3>
          <ul>
            <li>How you interact with our platform</li>
            <li>Features you use and time spent</li>
            <li>Performance and crash data</li>
            <li>Device and browser information</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send technical notices and support messages</li>
            <li>Communicate with you about products, services, and events</li>
            <li>Monitor and analyze trends and usage</li>
            <li>Detect, investigate, and prevent security incidents</li>
          </ul>

          <h2>3. Information Sharing</h2>
          <p>
            We do not sell, trade, or otherwise transfer your personal information to third parties
            without your consent, except as described in this policy.
          </p>

          <h3>Service Providers</h3>
          <p>
            We may share information with third-party service providers who perform services on our
            behalf, such as payment processing, data analytics, and customer support.
          </p>

          <h3>Legal Requirements</h3>
          <p>
            We may disclose your information if required by law or in good faith belief that such
            action is necessary to comply with legal obligations.
          </p>

          <h2>4. Data Security</h2>
          <p>
            We take reasonable measures to protect your information from unauthorized access, use,
            or disclosure. This includes encryption, secure servers, and regular security audits.
          </p>

          <h2>5. Data Retention</h2>
          <p>
            We retain your personal information for as long as necessary to provide the services and
            fulfill the purposes outlined in this policy, unless a longer retention period is
            required or permitted by law.
          </p>

          <h2>6. Your Rights</h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul>
            <li>Access and update your personal information</li>
            <li>Delete your account and associated data</li>
            <li>Opt-out of marketing communications</li>
            <li>Request a copy of your data</li>
            <li>Object to processing of your information</li>
          </ul>

          <h2>7. Cookies and Tracking</h2>
          <p>
            We use cookies and similar tracking technologies to enhance your experience, analyze
            usage, and personalize content. You can control cookies through your browser settings.
          </p>

          <h2>8. International Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than your own.
            We ensure appropriate safeguards are in place for such transfers.
          </p>

          <h2>9. Children's Privacy</h2>
          <p>
            Our services are not intended for children under 13. We do not knowingly collect
            personal information from children under 13.
          </p>

          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of any changes
            by posting the new policy on this page and updating the "Last updated" date.
          </p>

          <h2>11. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at
            privacy@yourplatform.com
          </p>

          <h2>12. California Residents</h2>
          <p>
            If you are a California resident, you have specific rights under the California Consumer
            Privacy Act (CCPA). Learn more about your rights and how to exercise them by contacting
            us.
          </p>

          <h2>13. GDPR Rights</h2>
          <p>
            If you are located in the EU, you have rights under the General Data Protection
            Regulation (GDPR). These include the right to access, rectify, erase, and restrict
            processing of your personal data.
          </p>
        </div>
      </div>
    </div>
  )
}
