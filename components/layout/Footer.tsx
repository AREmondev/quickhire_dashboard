"use client";
import Link from "next/link";
import Image from "next/image";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { IMAGES } from "@/lib/constants";

const Footer = () => {
  return (
    <footer className="w-full bg-black text-white">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Image
                src={IMAGES.LOGO}
                width={32}
                height={32}
                alt="QuickHire logo"
              />
              <Text className="font-semibold" variant="title_lg">
                QuickHire
              </Text>
            </div>
            <Text className="text-neutral-60 max-w-xs" variant="body_sm">
              Great platform for the job seeker that passionate about startups.
              Find your dream job easier.
            </Text>
          </div>

          <div className="flex flex-col gap-4">
            <Text className="font-semibold" variant="title_lg">
              About
            </Text>
            <ul className="flex flex-col gap-3">
              <li>
                <Link href="#companies">
                  <Text
                    className="text-neutral-60 hover:text-white transition-colors"
                    variant="body_sm"
                  >
                    Companies
                  </Text>
                </Link>
              </li>
              <li>
                <Link href="#pricing">
                  <Text
                    className="text-neutral-60 hover:text-white transition-colors"
                    variant="body_sm"
                  >
                    Pricing
                  </Text>
                </Link>
              </li>
              <li>
                <Link href="#terms">
                  <Text
                    className="text-neutral-60 hover:text-white transition-colors"
                    variant="body_sm"
                  >
                    Terms
                  </Text>
                </Link>
              </li>
              <li>
                <Link href="#advice">
                  <Text
                    className="text-neutral-60 hover:text-white transition-colors"
                    variant="body_sm"
                  >
                    Advice
                  </Text>
                </Link>
              </li>
              <li>
                <Link href="#privacy">
                  <Text
                    className="text-neutral-60 hover:text-white transition-colors"
                    variant="body_sm"
                  >
                    Privacy Policy
                  </Text>
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <Text className="font-semibold" variant="title_lg">
              Resources
            </Text>
            <ul className="flex flex-col gap-3">
              <li>
                <Link href="#docs">
                  <Text
                    className="text-neutral-60 hover:text-white transition-colors"
                    variant="body_sm"
                  >
                    Help Docs
                  </Text>
                </Link>
              </li>
              <li>
                <Link href="#guide">
                  <Text
                    className="text-neutral-60 hover:text-white transition-colors"
                    variant="body_sm"
                  >
                    Guide
                  </Text>
                </Link>
              </li>
              <li>
                <Link href="#updates">
                  <Text
                    className="text-neutral-60 hover:text-white transition-colors"
                    variant="body_sm"
                  >
                    Updates
                  </Text>
                </Link>
              </li>
              <li>
                <Link href="#contact">
                  <Text
                    className="text-neutral-60 hover:text-white transition-colors"
                    variant="body_sm"
                  >
                    Contact Us
                  </Text>
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <Text className="font-semibold" variant="title_lg">
              Get job notifications
            </Text>
            <Text className="text-neutral-60" variant="body_sm">
              The latest job news, articles, sent to your inbox weekly.
            </Text>
            <form
              className="flex w-full gap-2 flex-col sm:flex-row"
              onSubmit={(e) => e.preventDefault()}
            >
              <label htmlFor="footer-email" className="sr-only">
                Email Address
              </label>
              <input
                id="footer-email"
                type="email"
                required
                placeholder="Email Address"
                className="h-12 rounded-lg sm:rounded-l-lg sm:rounded-r-none px-4 text-black placeholder:text-neutral-60 w-full bg-white"
              />
              <Button
                className="h-12 sm:rounded-l-none sm:rounded-r-lg bg-primary text-white"
                type="submit"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-60/20">
        <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <Text className="text-neutral-60" variant="body_sm">
            © {new Date().getFullYear()} QuickHire. All rights reserved.
          </Text>
          <div className="flex items-center gap-3">
            {["f", "ig", "db", "in", "tw"].map((label) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="w-10 h-10 rounded-full border border-neutral-60/30 inline-flex items-center justify-center text-white hover:bg-primary transition-colors"
              >
                <span className="text-sm uppercase">{label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
