export default function TermsPage() {
  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold">Terms of Service</h1>

        <div className="prose prose-invert max-w-none">
          <p className="text-text-muted">Last updated: {new Date().toLocaleDateString()}</p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using this platform, you accept and agree to be bound by the terms and
            provision of this agreement. If you do not agree to abide by the above, please do not
            use this service.
          </p>

          <h2>2. Use License</h2>
          <p>
            Permission is granted to temporarily use this platform for personal, non-commercial
            transitory viewing only. This is the grant of a license, not a transfer of title, and
            under this license you may not:
          </p>
          <ul>
            <li>modify or copy the materials</li>
            <li>use the materials for any commercial purpose</li>
            <li>attempt to reverse engineer any software</li>
            <li>remove any copyright or other proprietary notations</li>
          </ul>

          <h2>3. User Accounts</h2>
          <p>
            When you create an account with us, you must provide information that is accurate,
            complete, and current at all times. You are responsible for safeguarding the password
            and all activities that occur under your account.
          </p>

          <h2>4. Content</h2>
          <p>
            You retain ownership of all content you post on our platform. By posting content, you
            grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and display
            such content in connection with the service.
          </p>

          <h2>5. AI-Generated Content</h2>
          <p>
            Our platform provides AI-assisted content generation. You are responsible for all
            AI-generated content you publish and must ensure it complies with these terms and
            applicable laws.
          </p>

          <h2>6. Privacy</h2>
          <p>
            Your privacy is important to us. Please review our Privacy Policy, which also governs
            your use of the service, to understand our practices.
          </p>

          <h2>7. Paid Services</h2>
          <p>
            Certain features of the platform are available for a fee. All fees are non-refundable
            unless otherwise specified. We reserve the right to modify our fees at any time.
          </p>

          <h2>8. Prohibited Uses</h2>
          <p>You may not use our service to:</p>
          <ul>
            <li>Violate any applicable laws</li>
            <li>Post harmful, offensive, or illegal content</li>
            <li>Impersonate any person or entity</li>
            <li>Interfere with or disrupt the service</li>
            <li>Attempt to gain unauthorized access</li>
          </ul>

          <h2>9. Termination</h2>
          <p>
            We may terminate or suspend your account immediately, without prior notice or liability,
            for any reason whatsoever, including without limitation if you breach the Terms.
          </p>

          <h2>10. Limitation of Liability</h2>
          <p>
            In no event shall our company, nor its directors, employees, partners, agents,
            suppliers, or affiliates, be liable for any indirect, incidental, special,
            consequential, or punitive damages, including without limitation, loss of profits, data,
            use, goodwill, or other intangible losses.
          </p>

          <h2>11. Governing Law</h2>
          <p>
            These Terms shall be interpreted and governed by the laws of the jurisdiction in which
            our company is based, without regard to conflict of law provisions.
          </p>

          <h2>12. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any
            time. If a revision is material, we will provide at least 30 days notice prior to any
            new terms taking effect.
          </p>

          <h2>13. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us at legal@yourplatform.com
          </p>
        </div>
      </div>
    </div>
  )
}
