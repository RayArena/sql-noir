import { useParams, Navigate, Link } from "react-router-dom";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Terminal, Database, CheckCircle, Circle, Lock, Lightbulb, ChevronRight } from "lucide-react";
import { CASES, type CaseObjective } from "@/data/cases";
import { useGameProgress } from "@/hooks/useGameProgress";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

const CasePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const gameCase = CASES.find((c) => c.slug === slug);
  const { getCurrentObjective, advanceObjective, isCaseUnlocked, isCaseCompleted } = useGameProgress();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"terminal" | "schema">("terminal");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Record<string, unknown>[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showHint, setShowHint] = useState<string | null>(null);
  const [narratives, setNarratives] = useState<string[]>([]);
  const [queryHistory, setQueryHistory] = useState<string[]>([]);

  const currentObjIdx = gameCase ? getCurrentObjective(gameCase.id) : 0;
  const completed = gameCase ? isCaseCompleted(gameCase.id) : false;
  const currentObjective: CaseObjective | undefined = gameCase?.objectives[currentObjIdx];

  const executeQuery = useCallback(async () => {
    if (!query.trim() || !currentObjective) return;
    setIsRunning(true);
    setError(null);
    setResults(null);

    setQueryHistory((prev) => [query, ...prev.slice(0, 19)]);

    // Simulate query execution for now (will be replaced by edge function)
    setTimeout(() => {
      try {
        // Mock: generate fake results based on the objective
        const mockResults = generateMockResults(gameCase.id, currentObjIdx, query);

        if (mockResults.error) {
          setError(mockResults.error);
          setIsRunning(false);
          return;
        }

        setResults(mockResults.rows);

        // Validate
        if (currentObjective.validationFn(mockResults.rows)) {
          toast({
            title: "🔍 " + currentObjective.successMessage,
            description: "Objective complete.",
          });
          setNarratives((prev) => [...prev, currentObjective.narrativeAfter]);
          advanceObjective(gameCase.id, gameCase.objectives.length);
        }
      } catch {
        setError("Syntax error in query. Check your SQL and try again, detective.");
      }
      setIsRunning(false);
    }, 800);
  }, [query, currentObjective, gameCase, currentObjIdx, advanceObjective, toast]);

  if (!gameCase) return <Navigate to="/cases" />;
  if (!isCaseUnlocked(gameCase.id)) return <Navigate to="/cases" />;

  return (
    <div className="h-screen flex flex-col noir-gradient">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <Link to="/cases" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="font-typewriter text-primary text-lg tracking-wider">{gameCase.title}</h1>
        <Badge className="font-typewriter text-[10px] border border-primary/30 bg-primary/10 text-primary ml-auto">
          {gameCase.subtitle}
        </Badge>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Case Guide */}
        <div className="w-80 lg:w-96 border-r border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <h2 className="font-typewriter text-sm text-primary tracking-widest uppercase">Case Briefing</h2>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {/* Briefing */}
              <div className="case-file rounded p-4 text-sm">
                <p className="font-mono-case text-noir-ink/80 leading-relaxed text-xs">{gameCase.briefing}</p>
              </div>

              {/* Objectives */}
              <div className="space-y-2">
                <h3 className="font-typewriter text-xs text-muted-foreground tracking-widest uppercase">Objectives</h3>
                {gameCase.objectives.map((obj, i) => {
                  const isActive = i === currentObjIdx && !completed;
                  const isDone = i < currentObjIdx || completed;
                  const isLocked = i > currentObjIdx && !completed;

                  return (
                    <div
                      key={obj.id}
                      className={`p-3 rounded border ${
                        isActive
                          ? "border-primary/40 bg-primary/5"
                          : isDone
                          ? "border-noir-green/20 bg-noir-green/5"
                          : "border-border bg-secondary/30 opacity-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isDone ? (
                          <CheckCircle className="w-4 h-4 text-noir-green shrink-0" />
                        ) : isActive ? (
                          <ChevronRight className="w-4 h-4 text-primary shrink-0" />
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        )}
                        <span className={`font-typewriter text-xs ${isActive ? "text-primary" : isDone ? "text-noir-green" : "text-muted-foreground"}`}>
                          {obj.title}
                        </span>
                      </div>
                      {(isActive || isDone) && (
                        <p className="text-xs text-muted-foreground mt-1.5 ml-6 leading-relaxed">
                          {obj.description}
                        </p>
                      )}
                      {isActive && (
                        <button
                          onClick={() => setShowHint(showHint === obj.id ? null : obj.id)}
                          className="flex items-center gap-1 mt-2 ml-6 text-[10px] text-primary/60 hover:text-primary transition-colors font-mono-case"
                        >
                          <Lightbulb className="w-3 h-3" /> {showHint === obj.id ? "Hide Hint" : "Need a hint?"}
                        </button>
                      )}
                      {showHint === obj.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="ml-6 mt-2 p-2 rounded bg-primary/10 border border-primary/20"
                        >
                          <code className="text-[10px] text-primary/80 font-mono">{obj.hint}</code>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Narrative updates */}
              {narratives.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-typewriter text-xs text-muted-foreground tracking-widest uppercase">Case Notes</h3>
                  {narratives.map((n, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="case-file rounded p-3"
                    >
                      <p className="font-mono-case text-noir-ink/80 text-xs italic leading-relaxed">{n}</p>
                    </motion.div>
                  ))}
                </div>
              )}

              {completed && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-6"
                >
                  <div className="stamp-effect inline-block font-typewriter text-lg animate-stamp-slam">
                    Case Closed
                  </div>
                </motion.div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* RIGHT: Workspace */}
        <div className="flex-1 flex flex-col">
          {/* Tab toggle */}
          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTab("terminal")}
              className={`flex items-center gap-2 px-5 py-3 font-typewriter text-xs tracking-widest uppercase transition-colors ${
                activeTab === "terminal"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Terminal className="w-3.5 h-3.5" /> SQL Terminal
            </button>
            <button
              onClick={() => setActiveTab("schema")}
              className={`flex items-center gap-2 px-5 py-3 font-typewriter text-xs tracking-widest uppercase transition-colors ${
                activeTab === "schema"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Database className="w-3.5 h-3.5" /> Schema
            </button>
          </div>

          {activeTab === "terminal" ? (
            <div className="flex-1 flex flex-col">
              {/* Query input */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-xs text-noir-green terminal-glow">sql&gt;</span>
                  <span className="font-mono-case text-xs text-muted-foreground">Write your query</span>
                </div>
                <Textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="SELECT * FROM ..."
                  className="font-mono text-sm bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground/50 min-h-[100px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      executeQuery();
                    }
                  }}
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] text-muted-foreground font-mono-case">
                    {navigator.platform.includes("Mac") ? "⌘" : "Ctrl"}+Enter to run
                  </span>
                  <Button
                    onClick={executeQuery}
                    disabled={isRunning || !query.trim() || completed}
                    size="sm"
                    className="font-typewriter tracking-wider text-xs"
                  >
                    {isRunning ? "Executing..." : "Run Query"}
                  </Button>
                </div>
              </div>

              {/* Results */}
              <ScrollArea className="flex-1">
                <div className="p-4">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-3 rounded border border-destructive/30 bg-destructive/10 mb-4"
                    >
                      <p className="font-mono text-xs text-destructive">{error}</p>
                    </motion.div>
                  )}

                  {results && results.length > 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <p className="font-mono-case text-[10px] text-muted-foreground mb-2">
                        {results.length} row{results.length !== 1 ? "s" : ""} returned
                      </p>
                      <div className="border border-border rounded overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-secondary/50">
                              {Object.keys(results[0]).map((key) => (
                                <TableHead key={key} className="font-mono text-xs text-primary/80 py-2 px-3">
                                  {key}
                                </TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {results.map((row, i) => (
                              <TableRow key={i}>
                                {Object.values(row).map((val, j) => (
                                  <TableCell key={j} className="font-mono text-xs py-1.5 px-3 text-foreground/80">
                                    {String(val ?? "NULL")}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </motion.div>
                  )}

                  {results && results.length === 0 && (
                    <p className="font-mono-case text-xs text-muted-foreground italic">No results returned.</p>
                  )}

                  {/* Query history */}
                  {queryHistory.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-typewriter text-[10px] text-muted-foreground tracking-widest uppercase mb-2">
                        Query History
                      </h4>
                      <div className="space-y-1">
                        {queryHistory.map((q, i) => (
                          <button
                            key={i}
                            onClick={() => setQuery(q)}
                            className="block w-full text-left font-mono text-[11px] text-muted-foreground hover:text-foreground truncate py-1 px-2 rounded hover:bg-secondary/50 transition-colors"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          ) : (
            /* Schema Diagram */
            <ScrollArea className="flex-1">
              <div className="p-6 space-y-6">
                <h3 className="font-typewriter text-xs text-muted-foreground tracking-widest uppercase">
                  Evidence Database Schema
                </h3>
                <div className="grid gap-6">
                  {gameCase.schema.tables.map((table) => (
                    <div key={table.name} className="case-file rounded p-4">
                      <h4 className="font-typewriter text-sm text-noir-ink mb-3 border-b border-noir-ink/20 pb-2">
                        📁 {table.name}
                      </h4>
                      <div className="space-y-1">
                        {table.columns.map((col) => (
                          <div key={col.name} className="flex items-center gap-3 font-mono text-xs">
                            <span className="text-noir-ink/80 w-36">{col.name}</span>
                            <span className="text-noir-ink/50 text-[10px]">{col.type}</span>
                            {col.key && (
                              <Badge className="text-[8px] bg-noir-amber/20 text-noir-amber border-noir-amber/30 px-1.5 py-0">
                                {col.key}
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                      {table.references && table.references.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-noir-ink/10">
                          <p className="font-mono-case text-[10px] text-noir-ink/40 mb-1">References:</p>
                          {table.references.map((ref, i) => (
                            <p key={i} className="font-mono text-[10px] text-noir-ink/60">
                              {ref.column} → {ref.refTable}.{ref.refColumn}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  );
};

// Mock result generator - will be replaced by actual DB queries via edge function
function generateMockResults(caseId: number, objectiveIdx: number, query: string): { rows: Record<string, unknown>[]; error?: string } {
  const q = query.toLowerCase().trim();

  if (!q.startsWith("select")) {
    return { rows: [], error: "Only SELECT queries are allowed, detective. We're reading data, not tampering with evidence." };
  }

  // Case 1: The Missing Witness
  if (caseId === 1) {
    if (objectiveIdx === 0) {
      if (q.includes("citizens") && (q.includes("elena") || q.includes("vasquez") || q.includes("*"))) {
        return {
          rows: [
            { id: 7, first_name: "Elena", last_name: "Vasquez", age: 34, address: "42 River Lane", district: "Riverside", occupation: "Accountant", phone: "555-0147", status: "missing" },
          ],
        };
      }
      return { rows: [
        { id: 1, first_name: "John", last_name: "Miller", age: 45, address: "12 Oak St", district: "Downtown", occupation: "Lawyer", phone: "555-0101", status: "active" },
        { id: 3, first_name: "Sarah", last_name: "Chen", age: 29, address: "88 Pine Ave", district: "Eastside", occupation: "Teacher", phone: "555-0103", status: "active" },
        { id: 7, first_name: "Elena", last_name: "Vasquez", age: 34, address: "42 River Lane", district: "Riverside", occupation: "Accountant", phone: "555-0147", status: "missing" },
      ]};
    }
    if (objectiveIdx === 1) {
      if (q.includes("sightings")) {
        return {
          rows: [
            { id: 1, citizen_id: 7, location: "Riverside Cafe", seen_at: "2024-03-12 09:30:00", reported_by: "Officer Davis" },
            { id: 2, citizen_id: 7, location: "5th & Main Warehouse", seen_at: "2024-03-13 22:15:00", reported_by: "Anonymous" },
          ],
        };
      }
    }
    if (objectiveIdx === 2) {
      if (q.includes("citizens") && q.includes("riverside")) {
        return {
          rows: [
            { id: 5, first_name: "Marco", last_name: "Rivera", age: 41, address: "38 River Lane", district: "Riverside", occupation: "Mechanic", phone: "555-0130", status: "active" },
            { id: 9, first_name: "Linda", last_name: "Park", age: 52, address: "50 River Lane", district: "Riverside", occupation: "Retired", phone: "555-0160", status: "active" },
            { id: 12, first_name: "Tom", last_name: "Nguyen", age: 28, address: "44 River Lane", district: "Riverside", occupation: "Freelancer", phone: "555-0177", status: "active" },
          ],
        };
      }
    }
  }

  // Case 2
  if (caseId === 2) {
    if (objectiveIdx === 0) {
      if (q.includes("join") && q.includes("bank_accounts")) {
        return {
          rows: [
            { full_name: "Alice Monroe", bank_name: "First National", balance: 15200 },
            { full_name: "Marcus Webb", bank_name: "City Trust", balance: 87500 },
            { full_name: "David Chen", bank_name: "Pacific Bank", balance: 62300 },
            { full_name: "Marcus Webb", bank_name: "Pacific Bank", balance: 41000 },
            { full_name: "Sofia Grant", bank_name: "First National", balance: 8900 },
            { full_name: "David Chen", bank_name: "City Trust", balance: 23400 },
          ],
        };
      }
    }
    if (objectiveIdx === 1) {
      if (q.includes("join") && q.includes("ssn_hash")) {
        return {
          rows: [
            { full_name: "Marcus Webb", full_name_2: "David Chen", ssn_hash: "a7f3b2c9d1e5" },
          ],
        };
      }
    }
    if (objectiveIdx === 2) {
      if (q.includes("left join") && q.includes("id_documents")) {
        return {
          rows: [
            { full_name: "Marcus Webb", doc_type: "passport", is_valid: false },
            { full_name: "David Chen", doc_type: "driver_license", is_valid: false },
            { full_name: "David Chen", doc_type: null, is_valid: null },
          ],
        };
      }
    }
  }

  // Case 3
  if (caseId === 3) {
    if (objectiveIdx === 0) {
      if (q.includes("group by") && q.includes("district")) {
        return {
          rows: [
            { district: "Downtown", crime_count: 5 },
            { district: "Westside", crime_count: 2 },
            { district: "Eastside", crime_count: 3 },
            { district: "Harbor", crime_count: 2 },
          ],
        };
      }
    }
    if (objectiveIdx === 1) {
      if (q.includes("sum") && q.includes("group by")) {
        return {
          rows: [
            { name: "Viktor Petrov", total: 890000 },
            { name: "Nina Sorokina", total: 340000 },
            { name: "Alexei Volkov", total: 210000 },
            { name: "Dmitri Kask", total: 150000 },
          ],
        };
      }
    }
    if (objectiveIdx === 2) {
      if (q.includes("having") && q.includes("count")) {
        return {
          rows: [
            { name: "Viktor Petrov", alias: "The Ghost", jobs: 8 },
          ],
        };
      }
    }
  }

  // Case 4
  if (caseId === 4) {
    if (objectiveIdx === 0) {
      if (q.includes("select") && q.includes("clearance_level") && q.includes("avg")) {
        return {
          rows: [
            { id: 3, name: "Rachel Torres", department: "Security", role: "Head of Security", salary: 95000, clearance_level: 5 },
            { id: 7, name: "James Morton", department: "IT", role: "Systems Admin", salary: 88000, clearance_level: 4 },
            { id: 11, name: "Karen Cho", department: "Management", role: "Director", salary: 120000, clearance_level: 5 },
            { id: 15, name: "Robert Hale", department: "Security", role: "Night Guard Lead", salary: 52000, clearance_level: 4 },
          ],
        };
      }
    }
    if (objectiveIdx === 1) {
      if (q.includes("access_logs") && q.includes("vault")) {
        return {
          rows: [
            { name: "Rachel Torres", area: "Vault", accessed_at: "2024-03-15 21:47:00" },
            { name: "Robert Hale", area: "Vault", accessed_at: "2024-03-15 19:00:00" },
          ],
        };
      }
    }
    if (objectiveIdx === 2) {
      if (q.includes("transactions") && q.includes("salary")) {
        return {
          rows: [
            { name: "Rachel Torres", amount: 200000, salary: 95000 },
          ],
        };
      }
    }
  }

  // Default: return some generic data
  return {
    rows: [
      { message: "Query executed but didn't match the current objective. Try a different approach, detective." },
    ],
  };
}

export default CasePage;
