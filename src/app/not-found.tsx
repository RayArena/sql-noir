import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen noir-gradient relative flex items-center justify-center">
      {/* Noise overlay */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-10 text-center px-4">
        <FileQuestion className="w-12 h-12 text-primary/40 mx-auto mb-6" />

        <h1 className="font-typewriter text-6xl text-primary tracking-wider mb-2">
          404
        </h1>
        <div className="w-24 h-px bg-primary/30 mx-auto my-4" />
        <p className="font-typewriter text-lg text-muted-foreground tracking-wide mb-2">
          Case File Not Found
        </p>
        <p className="font-mono-case text-sm text-muted-foreground/60 mb-8 max-w-md mx-auto">
          This trail has gone cold, detective. The file you&apos;re looking for
          doesn&apos;t exist in our records.
        </p>

        <Button
          asChild
          className="font-typewriter text-sm tracking-widest uppercase bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-5"
        >
          <Link href="/">Return to HQ</Link>
        </Button>
      </div>
    </div>
  );
}
