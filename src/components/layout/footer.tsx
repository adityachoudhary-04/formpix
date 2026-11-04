import React from "react";
import Link from "next/link";
import { Camera, Shield } from "lucide-react";

const toolLinks = [
  { href: "/photo-resizer", label: "Photo Resizer" },
  { href: "/signature-resizer", label: "Signature Resizer" },
  { href: "/image-compressor", label: "Image Compressor" },
  { href: "/signature-compressor", label: "Signature Compressor" },
  { href: "/add-name-date", label: "Add Name & Date" },
];

const examLinks = [
  { href: "/exams?category=upsc", label: "UPSC" },
  { href: "/exams?category=ssc", label: "SSC" },
  { href: "/exams?category=banking", label: "Banking" },
  { href: "/exams?category=railway", label: "Railway" },
  { href: "/exams?category=state-psc", label: "State PSC" },
  { href: "/exams?category=police", label: "Police" },
  { href: "/exams?category=teaching", label: "Teaching" },
  { href: "/exams?category=entrance-exams", label: "Entrance Exams" },
];

const legalLinks = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Camera className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                FormPix
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Free online tool to resize and compress passport photos and
              signatures for government exam applications. No uploads — all
              processing happens securely in your browser.
            </p>
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-2">
              <Shield className="h-4 w-4 flex-shrink-0 text-primary" />
              <span className="text-xs text-muted-foreground">
                100% Private — Photos never leave your device
              </span>
            </div>
          </div>

          {/* Tools Column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Tools
            </h3>
            <ul className="mt-4 space-y-2.5">
              {toolLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Exams Column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Exam Categories
            </h3>
            <ul className="mt-4 space-y-2.5">
              {examLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Company
            </h3>
            <ul className="mt-4 space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {currentYear} FormPix. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
            All processing happens in your browser — your images never leave
            your device
          </p>
        </div>
      </div>
    </footer>
  );
}
