"use client";

import { Logo } from "@/config/Logo";
import { siteConfig } from "@/config/site";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full pt-6 mt-24 border-t border-default-100 bg-gradient-to-b from-default-50/50 to-default-100/40 backdrop-blur">
      
      <div className="container  mx-auto px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">

          {/* 🔹 Brand Section */}
          <div className="flex flex-col gap-5">
            <Link href="#" className="flex items-center gap-2 w-fit group">
              <Logo />
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-[#FF1CF7] to-[#b249f8] bg-clip-text text-transparent group-hover:opacity-80 transition">
                {siteConfig?.name}
              </span>
            </Link>

            <p className="text-sm text-default-500 leading-relaxed max-w-xs">
              AI-powered mock interviews to help you land your dream job faster.
            </p>

            {/* subtle glow */}
            <div className="w-12 h-1 rounded-full bg-gradient-to-r from-[#FF1CF7] to-[#b249f8]" />
          </div>

          {/* 🔹 Navigation Links */}
          <div className="flex flex-col gap-4">
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
                  className="text-sm text-default-500 hover:text-[#b249f8] transition-all duration-300 w-fit relative group"
                >
                  {link.label}

                  {/* animated underline */}
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-[#FF1CF7] to-[#b249f8] group-hover:w-full transition-all duration-300 rounded-full" />

                  {/* hover glow */}
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 blur-md bg-[#b249f8]/20 transition duration-300 rounded" />
                </Link>
              ))}
            </div>
          </div>

          {/* 🔥 CTA Section */}
          <div className="flex flex-col gap-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-default-400">
              Ready to Ace It?
            </p>

            <p className="text-sm text-default-500 leading-relaxed max-w-xs">
              Start practicing today and walk into your next interview with confidence.
            </p>

            <Link
              href="/subscribe"
              className="relative inline-flex w-fit items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium text-white 
              bg-gradient-to-r from-[#FF1CF7] to-[#b249f8]
              shadow-lg hover:shadow-purple-300/40
              hover:scale-105 active:scale-95
              transition-all duration-300"
            >
              Subscribe

              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>

              {/* glow effect */}
              <span className="absolute inset-0 rounded-full blur-md opacity-30 bg-[#b249f8]" />
            </Link>
          </div>
        </div>

        
        {/* 🔹 Bottom Bar */}
        <div className="pb-6 flex flex-col items-center justify-between gap-4 md:flex-row">

          <p className="text-xs text-default-400">
            &copy; {new Date().getFullYear()}{" "}
            <span className="font-medium text-default-600">
              {siteConfig?.name}
            </span>. All rights reserved.
          </p>

          <div className="flex items-center gap-2 text-xs text-default-400">
            <span>Made with</span>
            <span className="text-[#FF1CF7] animate-pulse">♥</span>
            <span>for job seekers</span>
          </div>

        </div>
      </div>
    </footer>
  );
}