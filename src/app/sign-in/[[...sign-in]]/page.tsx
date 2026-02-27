import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="fixed inset-0 top-[57px] overflow-y-auto scrollbar-hide noir-gradient">
      <div className="grid min-h-full place-items-center px-4 py-8">
        {/* Subtle noise overlay */}
        <div
          className="fixed inset-0 top-[57px] opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
          }}
        />

        <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-[420px]">
          {/* Header */}
          <div className="text-center">
            <h1 className="font-typewriter text-5xl tracking-widest mb-3">
              <span className="text-primary">SQL</span>{" "}
              <span className="text-foreground font-bold">NOIR</span>
            </h1>
            <p className="font-typewriter text-muted-foreground tracking-wide text-sm">
              Present your credentials, Detective.
            </p>
          </div>

          {/* Clerk SignIn */}
          <SignIn
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent border-none shadow-none p-0 w-full",
                cardBox: "shadow-none w-full",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                header: "hidden",
                socialButtonsBlockButton:
                  "border border-border bg-secondary text-foreground font-typewriter text-sm tracking-wider hover:bg-secondary/80 !rounded-none h-11",
                socialButtonsBlockButtonText: "font-typewriter text-sm",
                dividerLine: "bg-border",
                dividerText: "text-muted-foreground font-typewriter text-xs",
                formFieldLabel: "hidden",
                formFieldInput:
                  "bg-[hsl(220,15%,18%)] border border-[hsl(220,15%,20%)] text-foreground font-mono-case placeholder:text-muted-foreground/60 focus:border-primary focus:ring-0 !rounded-none h-12 text-sm px-4",
                formButtonPrimary:
                  "bg-primary text-primary-foreground font-typewriter tracking-widest uppercase hover:bg-primary/90 !rounded-none w-full h-12 text-sm mt-1",
                footerActionLink:
                  "text-primary font-typewriter text-sm hover:text-primary/80",
                footerActionText:
                  "text-muted-foreground font-typewriter text-sm",
                footer: "bg-transparent border-none shadow-none pt-2",
                footerAction: "bg-transparent",
                footerPages: "hidden",
                badge: "hidden",
                identityPreviewText: "text-foreground font-typewriter",
                identityPreviewEditButton: "text-primary hover:text-primary/80",
                formResendCodeLink: "text-primary hover:text-primary/80 font-typewriter text-sm",
                alert: "bg-destructive/10 border border-destructive/30 text-destructive-foreground !rounded-none",
                alertText: "font-typewriter text-sm",
                formFieldRow: "mb-2",
                main: "gap-2",
              },
              variables: {
                colorPrimary: "hsl(38 70% 50%)",
                colorBackground: "transparent",
                colorInputBackground: "hsl(220 15% 18%)",
                colorInputText: "hsl(40 20% 85%)",
                colorText: "hsl(40 20% 85%)",
                colorTextSecondary: "hsl(220 10% 50%)",
                colorDanger: "hsl(0 60% 45%)",
                borderRadius: "0rem",
                fontFamily: "'Special Elite', cursive",
                fontSize: "0.9rem",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
