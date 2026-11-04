"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Camera,
  ChevronDown,
  Image,
  PenTool,
  Minimize2,
  FileSignature,
  CalendarPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/photo-resizer", label: "Photo Resizer", icon: Image },
  { href: "/signature-resizer", label: "Signature Resizer", icon: PenTool },
  {
    href: "/image-compressor",
    label: "Image Compressor",
    icon: Minimize2,
  },
  {
    href: "/signature-compressor",
    label: "Signature Compressor",
    icon: FileSignature,
  },
  { href: "/add-name-date", label: "Add Name & Date", icon: CalendarPlus },
];

const examCategories = [
  { label: "UPSC", slug: "upsc" },
  { label: "SSC", slug: "ssc" },
  { label: "Banking", slug: "banking" },
  { label: "Railway", slug: "railway" },
  { label: "State PSC", slug: "state-psc" },
  { label: "Police", slug: "police" },
  { label: "Teaching", slug: "teaching" },
  { label: "Entrance Exams", slug: "entrance-exams" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [examDropdownOpen, setExamDropdownOpen] = useState(false);
  const [mobileExamOpen, setMobileExamOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setMobileExamOpen(false);
  }, [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setExamDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Camera className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-tight tracking-tight">
              SarkariPhoto
            </span>
            <span className="hidden text-[10px] leading-tight text-muted-foreground sm:block">
              Free Exam Photo &amp; Signature Tools
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                isActive(link.href)
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}

          {/* Exam Categories Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setExamDropdownOpen(!examDropdownOpen)}
              className={cn(
                "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname.startsWith("/exams")
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              )}
            >
              Exam Categories
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform duration-200",
                  examDropdownOpen && "rotate-180"
                )}
              />
            </button>

            {examDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-52 rounded-lg border bg-popover p-1.5 shadow-lg animate-in fade-in-0 zoom-in-95">
                {examCategories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/exams?category=${cat.slug}`}
                    onClick={() => setExamDropdownOpen(false)}
                    className="flex items-center rounded-md px-3 py-2 text-sm text-popover-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Right side: Theme toggle + Mobile menu button */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* Mobile Hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation - Sliding drawer from right */}
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden",
          mobileOpen
            ? "opacity-100"
            : "pointer-events-none opacity-0"
        )}
        onClick={() => setMobileOpen(false)}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-80 max-w-[85vw] transform border-l bg-background transition-transform duration-300 ease-in-out lg:hidden",
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Drawer header */}
          <div className="flex items-center justify-between border-b px-4 py-4">
            <Link
              href="/"
              className="flex items-center gap-2"
              onClick={() => setMobileOpen(false)}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Camera className="h-4 w-4" />
              </div>
              <span className="text-base font-bold">SarkariPhoto</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Drawer content */}
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <div className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                      isActive(link.href)
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Exam Categories */}
            <div className="mt-4 border-t pt-4">
              <button
                onClick={() => setMobileExamOpen(!mobileExamOpen)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Exam Categories
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    mobileExamOpen && "rotate-180"
                  )}
                />
              </button>

              <div
                className={cn(
                  "mt-1 space-y-0.5 overflow-hidden pl-3 transition-all duration-200",
                  mobileExamOpen
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                )}
              >
                {examCategories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/exams?category=${cat.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          {/* Drawer footer */}
          <div className="border-t p-4">
            <p className="text-center text-xs text-muted-foreground">
              All processing happens in your browser.
              <br />
              Your photos never leave your device.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
