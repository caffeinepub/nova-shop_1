import { Link } from "@tanstack/react-router";
import { SiFacebook, SiInstagram, SiPinterest, SiX } from "react-icons/si";

const currentYear = new Date().getFullYear();
const hostname =
  typeof window !== "undefined" ? window.location.hostname : "nova-shop";

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-col items-center gap-8">
          {/* Brand */}
          <div className="text-center">
            <h2 className="font-editorial text-2xl font-bold tracking-widest uppercase">
              Nova Shop
            </h2>
            <p className="mt-2 text-sm opacity-60 tracking-wide font-body">
              Premium quality, timeless style.
            </p>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-6">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-60 hover:opacity-100 transition-opacity"
              aria-label="Instagram"
            >
              <SiInstagram size={20} />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-60 hover:opacity-100 transition-opacity"
              aria-label="X (Twitter)"
            >
              <SiX size={18} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-60 hover:opacity-100 transition-opacity"
              aria-label="Facebook"
            >
              <SiFacebook size={20} />
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-60 hover:opacity-100 transition-opacity"
              aria-label="Pinterest"
            >
              <SiPinterest size={20} />
            </a>
          </div>

          {/* Quick Links */}
          <div className="flex items-center gap-6">
            <Link
              to="/faq"
              className="text-sm opacity-60 hover:opacity-100 transition-opacity font-body tracking-wide uppercase"
            >
              FAQ
            </Link>
            <span className="opacity-30">·</span>
            <Link
              to="/support"
              className="text-sm opacity-60 hover:opacity-100 transition-opacity font-body tracking-wide uppercase"
            >
              Customer Support
            </Link>
          </div>

          {/* Divider */}
          <div className="w-full border-t border-white/10" />

          {/* Copyright */}
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center">
            <p className="text-sm opacity-50 font-body tracking-wide">
              &copy; {currentYear} Nova Shop. All rights reserved.
            </p>
            <span className="hidden sm:inline opacity-30">·</span>
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm opacity-40 hover:opacity-70 transition-opacity font-body"
            >
              Built with ❤ using caffeine.ai
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
