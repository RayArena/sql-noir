"use client";

import Link from "next/link";
import { NavLink } from "@/components/NavLink";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-background/95 backdrop-blur-sm border-b border-border">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-1 select-none">
        <span className="font-typewriter text-xl tracking-widest text-primary">SQL</span>
        <span className="font-typewriter text-xl tracking-widest text-primary font-bold">NOIR</span>
      </Link>

      {/* Right side */}
      <div className="flex items-center gap-5">
        <SignedIn>
          <nav className="flex items-center gap-5">
            <NavLink
              href="/cases"
              className="font-typewriter text-sm tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors"
              activeClassName="text-primary"
            >
              Cases
            </NavLink>
            <NavLink
              href="/profile"
              className="font-typewriter text-sm tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors"
              activeClassName="text-primary"
            >
              Profile
            </NavLink>
          </nav>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-9 h-9 border-2 border-primary/50 rounded-full",
                userButtonPopoverCard: "bg-card border border-border",
                userButtonPopoverActionButton: "text-foreground hover:text-primary",
                userButtonPopoverFooter: "hidden",
              },
            }}
          />
        </SignedIn>

        <SignedOut>
          <SignInButton mode="redirect">
            <Button
              variant="outline"
              className="font-typewriter text-sm tracking-widest uppercase border-primary/60 text-primary hover:bg-primary hover:text-primary-foreground transition-colors px-5 py-2"
            >
              Sign In
            </Button>
          </SignInButton>
        </SignedOut>
      </div>
    </header>
  );
}
