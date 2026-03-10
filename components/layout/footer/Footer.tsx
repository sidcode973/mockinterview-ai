"use client";

import { Logo } from "@/config/Logo";
import { siteConfig } from "@/config/site";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-default-100 bg-default-50/50">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">

          {/* Brand Section */}
          <div className="flex flex-col gap-4">
            <Link href="#" className="flex items-center gap-2 w-fit" prefetch={false}>
              <Logo />
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-[#FF1CF7] to-[#b249f8] bg-clip-text text-transparent">
                {siteConfig?.name}
              </span>
            </Link>
            <p className="text-sm text-default-500 leading-relaxed max-w-[220px]">
              AI-powered mock interviews to help you land your dream job faster.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-default-400">
              Quick Links
            </p>
            <div className="flex flex-col gap-2">
              {[
                { label: "Home", href: "/" },
                { label: "About", href: "#" },
                { label: "Pricing", href: "/#pricing" },
                { label: "Contact", href: "#" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  prefetch={false}
                  className="text-sm text-default-500 hover:text-[#b249f8] transition-colors duration-200 w-fit relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-[#FF1CF7] to-[#b249f8] group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="flex flex-col gap-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-default-400">
              Ready to Ace It?
            </p>
            <p className="text-sm text-default-500 leading-relaxed">
              Start practicing today and walk into your next interview with confidence.
            </p>
            <Link
              href="/subscribe"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-[#FF1CF7] to-[#b249f8] px-5 py-2 text-sm font-medium text-white shadow-md hover:shadow-lg hover:shadow-purple-200 hover:scale-105 transition-all duration-300"
            >
              Subscribe
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-gradient-to-r from-transparent via-default-200 to-transparent" />

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
          <p className="text-xs text-default-400">
            &copy; {new Date().getFullYear()}{" "}
            <span className="font-medium text-default-500">{siteConfig?.name}</span>.
            All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-default-400">
            <span>Made with</span>
            <span className="text-[#FF1CF7] text-sm">♥</span>
            <span>for job seekers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}