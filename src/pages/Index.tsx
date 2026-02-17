import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, FileText, Database, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen noir-gradient relative overflow-hidden">
      {/* Subtle noise overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")" }} />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <span className="font-typewriter text-sm tracking-[0.3em] uppercase text-muted-foreground border border-border px-4 py-1.5">
            Case File #001
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-typewriter text-6xl md:text-8xl lg:text-9xl text-primary mb-4 tracking-wider text-center"
        >
          SQL NOIR
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="font-mono-case text-lg md:text-xl text-muted-foreground mb-2 italic text-center"
        >
          "Every query brings you closer to the truth"
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="w-48 h-px bg-primary/40 my-8"
        />

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-foreground/70 max-w-lg text-center mb-10 leading-relaxed"
        >
          Step into the shoes of a detective. Solve crimes by writing real SQL queries
          against case databases. Four cases. Four mysteries. Only your SQL skills can
          crack them.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <Button asChild size="lg" className="font-typewriter text-lg tracking-widest px-10 py-6 bg-primary text-primary-foreground hover:bg-primary/90 border border-primary/30">
            <Link to="/cases">Enter the Precinct</Link>
          </Button>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl w-full"
        >
          {[
            { icon: Search, label: "Investigate" },
            { icon: Terminal, label: "Query" },
            { icon: Database, label: "Analyze" },
            { icon: FileText, label: "Solve" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 text-muted-foreground/60">
              <Icon className="w-5 h-5" />
              <span className="font-typewriter text-xs tracking-widest uppercase">{label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </div>
  );
};

export default Index;
