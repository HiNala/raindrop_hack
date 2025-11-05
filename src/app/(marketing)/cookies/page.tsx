export default function CookiePage() {
  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold">Cookie Policy</h1>

        <div className="prose prose-invert max-w-none">
          <p className="text-text-muted">Last updated: {new Date().toLocaleDateString()}</p>

          <h2>1. What Are Cookies</h2>
          <p>
            Cookies are small text files that are stored on your device when you visit a website.
            They are widely used to make websites work more efficiently and provide information to
            website owners.
          </p>

          <h2>2. How We Use Cookies</h2>
          <p>We use cookies for several purposes:</p>

          <h3>Essential Cookies</h3>
          <p>
            These cookies are necessary for the website to function and cannot be switched off in
            our systems. They enable basic functions like page navigation and access to secure
            areas.
          </p>

          <h3>Performance Cookies</h3>
          <p>
            These cookies help us understand how visitors interact with our website by collecting
            and reporting information anonymously.
          </p>

          <h3>Functional Cookies</h3>
          <p>
            These cookies enable the website to provide enhanced functionality and personalization.
            They may be set by us or by third-party providers whose services we have added to our
            pages.
          </p>

          <h3>Marketing Cookies</h3>
          <p>
            These cookies are used to deliver advertisements that are relevant to you and your
            interests. They track your browsing habits across different websites to build a profile
            of your interests.
          </p>

          <h2>3. Types of Cookies We Use</h2>

          <h3>Session Cookies</h3>
          <p>
            These are temporary cookies that expire when you close your browser. They help us track
            your movement through our website during a single session.
          </p>

          <h3>Persistent Cookies</h3>
          <p>
            These remain on your device for a set period or until you delete them. They help us
            recognize you when you return to our website.
          </p>

          <h3>Third-Party Cookies</h3>
          <p>
            These are set by external services we use on our website, such as analytics tools,
            social media plugins, and advertising networks.
          </p>

          <h2>4. Managing Your Cookie Preferences</h2>
          <p>
            You can control and/or delete cookies as you wish. You can delete all cookies that are
            already on your device and you can set most browsers to prevent them from being placed.
          </p>

          <h3>Browser Settings</h3>
          <p>
            Most browsers allow you to control cookies through their settings. However, disabling
            cookies may affect your ability to use certain features of our website.
          </p>

          <h3>Cookie Banner</h3>
          <p>
            When you first visit our website, you&apos;ll see a cookie banner where you can accept or
            reject non-essential cookies. You can change your preferences at any time.
          </p>

          <h2>5. Third-Party Services</h2>
          <p>We use the following third-party services that may set cookies:</p>

          <h3>Google Analytics</h3>
          <p>
            Used to analyze website traffic and help us understand how visitors use our site. Learn
            more about Google Analytics cookies at the
            <a
              href="https://policies.google.com/technologies/types"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-400 hover:underline"
            >
              Google Privacy Policy
            </a>
            .
          </p>

          <h3>Social Media</h3>
          <p>
            Our social media buttons and widgets may set cookies to enable sharing functionality.
            Each social media platform has its own cookie policy.
          </p>

          <h2>6. Cookies We Use</h2>
          <table className="w-full border-collapse border border-dark-border">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="p-2 text-left">Cookie Name</th>
                <th className="p-2 text-left">Purpose</th>
                <th className="p-2 text-left">Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-dark-border">
                <td className="p-2">session_id</td>
                <td className="p-2">Maintains user session</td>
                <td className="p-2">Session</td>
              </tr>
              <tr className="border-b border-dark-border">
                <td className="p-2">preferences</td>
                <td className="p-2">Stores user preferences</td>
                <td className="p-2">30 days</td>
              </tr>
              <tr className="border-b border-dark-border">
                <td className="p-2">analytics_id</td>
                <td className="p-2">Tracks user behavior</td>
                <td className="p-2">2 years</td>
              </tr>
            </tbody>
          </table>

          <h2>7. Updates to This Policy</h2>
          <p>
            We may update this cookie policy from time to time to reflect changes in our practices
            or for other operational, legal, or regulatory reasons.
          </p>

          <h2>8. Contact Us</h2>
          <p>
            If you have any questions about our use of cookies, please contact us at
            privacy@yourplatform.com
          </p>

          <h2>9. Useful Links</h2>
          <ul>
            <li>
              <a href="/privacy" className="text-teal-400 hover:underline">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/terms" className="text-teal-400 hover:underline">
                Terms of Service
              </a>
            </li>
            <li>
              <a
                href="https://www.allaboutcookies.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-400 hover:underline"
              >
                All About Cookies
              </a>
            </li>
            <li>
              <a
                href="https://www.youronlinechoices.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-400 hover:underline"
              >
                Your Online Choices
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
