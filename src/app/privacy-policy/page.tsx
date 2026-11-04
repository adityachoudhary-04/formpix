import React from "react";
import { Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 md:py-16 space-y-8">
      <div className="space-y-3 border-b pb-6 border-border">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <Shield className="w-3.5 h-3.5" />
          <span>Privacy Guaranteed</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
        <p className="text-muted-foreground text-sm">Last updated: November 2026</p>
      </div>

      <div className="prose dark:prose-invert max-w-none text-muted-foreground space-y-6 text-sm leading-relaxed">
        <h2 className="text-lg font-bold text-foreground">1. Our Commitment to Your Privacy</h2>
        <p>
          At <strong>SarkariPhoto</strong>, user privacy is our highest priority. Because our tools are designed for
          preparing sensitive personal documents such as biometric passport photographs and handwritten signatures,
          we have engineered our application architecture so that <strong>no image or signature data is ever uploaded
          to our servers</strong>.
        </p>

        <h2 className="text-lg font-bold text-foreground">2. 100% Client-Side Processing</h2>
        <p>
          All operations—including image cropping, resizing, background removal, stroke enhancement, name and date stamping,
          and iterative compression—occur strictly on your device using client-side Web Technologies (HTML5 Canvas API,
          JavaScript, and browser memory).
        </p>
        <p>
          When you select or drop a file, it is loaded into your browser&apos;s local memory via <code>URL.createObjectURL()</code>.
          The file never leaves your computer, phone, or tablet.
        </p>

        <h2 className="text-lg font-bold text-foreground">3. Information We Collect</h2>
        <p>
          We do not require user accounts, email addresses, phone numbers, or registration to use any of our image editing
          tools. We do not store, view, or retain copies of your photos or signatures.
        </p>

        <h2 className="text-lg font-bold text-foreground">4. Cookies and Local Storage</h2>
        <p>
          We use local browser storage solely to remember client preferences, such as your dark/light theme setting. We do
          not use cross-site tracking cookies.
        </p>

        <h2 className="text-lg font-bold text-foreground">5. Third-Party Services</h2>
        <p>
          Our application is statically hosted. We do not integrate third-party image recognition, face biometric analytics,
          or profiling APIs.
        </p>

        <h2 className="text-lg font-bold text-foreground">6. Contact</h2>
        <p>
          If you have questions regarding this Privacy Policy, please reach out to us at <code>privacy@sarkariphoto.com</code>.
        </p>
      </div>
    </div>
  );
}
