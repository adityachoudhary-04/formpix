import React from "react";
import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 md:py-16 space-y-8">
      <div className="space-y-3 border-b pb-6 border-border">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          <FileText className="w-3.5 h-3.5" />
          <span>Terms & Conditions</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Terms of Use</h1>
        <p className="text-muted-foreground text-sm">Last updated: November 2026</p>
      </div>

      <div className="prose dark:prose-invert max-w-none text-muted-foreground space-y-6 text-sm leading-relaxed">
        <h2 className="text-lg font-bold text-foreground">1. Acceptance of Terms</h2>
        <p>
          By accessing and using <strong>SarkariPhoto</strong> (&quot;the Service&quot;), you agree to comply with and be bound
          by these Terms of Use. If you do not agree with any part of these terms, you must not use the website.
        </p>

        <h2 className="text-lg font-bold text-foreground">2. Description of Service</h2>
        <p>
          SarkariPhoto provides free browser-based image resizing, cropping, enhancement, and compression tools tailored for
          educational and competitive exam applicants. All processing is executed client-side within your browser.
        </p>

        <h2 className="text-lg font-bold text-foreground">3. Accuracy of Exam Specifications Disclaimer</h2>
        <p>
          While we strive to maintain accurate dimensions and size specifications for competitive examinations (such as
          UPSC, SSC, Banking, Railways, and State PSCs), exam recruitment boards frequently update their guidelines.
          <strong>
            You are solely responsible for reviewing the official examination notification published by the respective
            examination authority prior to submitting your application.
          </strong>
        </p>

        <h2 className="text-lg font-bold text-foreground">4. Limitation of Liability</h2>
        <p>
          SarkariPhoto is provided &quot;as is&quot; without warranties of any kind, whether express or implied. In no event
          shall the operators of SarkariPhoto be liable for any direct, indirect, incidental, or consequential damages,
          including but not limited to application rejection, disqualification, or missed deadlines arising out of or in
          connection with the use of this service.
        </p>

        <h2 className="text-lg font-bold text-foreground">5. Permitted Use</h2>
        <p>
          You agree to use this service only for lawful purposes related to preparing personal documents for legitimate
          educational or recruitment applications. You must not attempt to reverse engineer, disrupt, or exploit the
          service.
        </p>
      </div>
    </div>
  );
}
