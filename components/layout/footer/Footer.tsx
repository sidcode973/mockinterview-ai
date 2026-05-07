"use client";

import { Logo } from "@/config/Logo";
import { siteConfig } from "@/config/site";
import Link from "next/link";
import MagneticButton from "@/components/ui/MagneticButton";

export default function Footer() {
  return (
    <footer className="relative w-full mt-12 overflow-hidden border-t border-default-200/40">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-default-50/30 to-default-100/40 backdrop-blur-md" />
      <div
        className="absolute -top-px left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(178,73,248,0.6), rgba(34,211,238,0.6), rgba(255,28,247,0.6), transparent)",
        }}
      />

      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div className="flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-2 w-fit group">
              <Logo />
              <span className="text-xl font-bold tracking-tight text-gradient-fusion">
                {siteConfig?.name}
              </span>
            </Link>

            <p className="text-sm text-default-500 leading-relaxed max-w-xs">
              AI-powered mock interviews to help you land your dream job faster.
            </p>

            <div className="w-12 h-1 rounded-full bg-gradient-to-r from-[#FF1CF7] via-[#b249f8] to-[#22d3ee] shadow-[0_0_18px_rgba(178,73,248,0.55)]" />
          </div>

          <div className="flex flex-col md:items-center gap-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-default-400">
              Quick Links
            </p>

            <div className="flex flex-col gap-3">
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
                  className="text-sm text-default-500 hover:text-foreground transition-all duration-300 w-fit relative group"
                >
                  {link.label}
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-[#FF1CF7] to-[#22d3ee] group-hover:w-full transition-all duration-300 rounded-full" />
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:items-end gap-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-default-400">
              Ready to Ace It?
            </p>

            <p className="text-sm text-default-500 leading-relaxed max-w-xs md:text-right">
              Start practicing today and walk into your next interview with confidence.
            </p>

            <MagneticButton strength={0.35}>
              <Link
                href="/subscribe"
                className="relative inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#FF1CF7] via-[#b249f8] to-[#22d3ee] animate-gradient-pan shadow-lg shadow-fuchsia-500/30 hover:shadow-fuchsia-500/60 active:scale-95 transition-shadow duration-300"
              >
                Subscribe
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </MagneticButton>
          </div>
        </div>

        <div className="pt-10 mt-10 border-t border-default-200/40 flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-xs text-default-400">
            &copy; {new Date().getFullYear()}{" "}
            <span className="font-medium text-default-600">
              {siteConfig?.name}
            </span>
            . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
