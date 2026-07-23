// src/App.jsx
import React, {
  createContext, useContext, useEffect, useMemo, useRef, useState, useCallback,
} from "react";
import {
  Award, ChevronDown, Mail, Phone, MapPin, Github, Linkedin,
  Database, Cloud, Calendar, Users, Target, BookOpen, Briefcase,
  CheckCircle2, ArrowUpRight, Layers, Terminal, Workflow, Command,
  Brain, Zap, Sparkles, TrendingUp, Code2, ArrowRight, X, Search,
  Rocket, Cpu, ShieldCheck, Radio, Sun, Moon, Copy, Check, Send, Bot,
  GitBranch,
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

/* ============================
   PIPELINE STAGE MAP
   Every section is framed as a stage in a data-pipeline run —
   the mental model a data engineer actually works in.
   ============================ */
const STAGES = [
  { id: "about", code: "01", label: "INGEST", desc: "Profile intake" },
  { id: "experience", code: "02", label: "DEPLOY", desc: "Work history" },
  { id: "skills", code: "03", label: "SCHEMA", desc: "Stack & tooling" },
  { id: "strengths", code: "04", label: "OFFER", desc: "What I offer" },
  { id: "projects", code: "05", label: "LOAD", desc: "Shipped work" },
  { id: "certifications", code: "06", label: "VALIDATE", desc: "Credentials" },
  { id: "contact", code: "07", label: "SERVE", desc: "Get in touch" },
];
const SECTION_IDS = ["home", ...STAGES.map(s => s.id)];

/* ============================
   THEME — dark console + light "paper terminal"
   ============================ */
const THEMES = {
  night: {
    mode: "night",
    bg: "#070b0a", bgSecondary: "#0b1210",
    cardBg: "rgba(15,23,20,0.72)", cardBorder: "rgba(61,220,132,0.14)", cardBorderHover: "rgba(61,220,132,0.45)",
    navBg: "rgba(5,9,8,0.9)",
    text: "#eaf6ee", textSecondary: "#93a89d", textMuted: "#546a5f",
    inputBg: "rgba(5,9,8,0.6)", inputBorder: "rgba(61,220,132,0.18)",
    green: "#3ddc84", amber: "#f5b942", blue: "#5eb1ef", pink: "#ef6f9e", red: "#ef6f6f",
    onAccent: "#04140b",
    gridColor: "rgba(61,220,132,0.05)",
    spotlight: "rgba(61,220,132,0.10)",
  },
  day: {
    mode: "day",
    bg: "#f3f7f3", bgSecondary: "#e9f0ea",
    cardBg: "rgba(255,255,255,0.78)", cardBorder: "rgba(15,80,50,0.14)", cardBorderHover: "rgba(15,120,70,0.4)",
    navBg: "rgba(243,247,243,0.9)",
    text: "#0c1f16", textSecondary: "#3d5346", textMuted: "#71887a",
    inputBg: "rgba(255,255,255,0.65)", inputBorder: "rgba(15,80,50,0.2)",
    green: "#0f9a54", amber: "#b3790f", blue: "#1c7ab0", pink: "#b23a6d", red: "#c94848",
    onAccent: "#ffffff",
    gridColor: "rgba(15,80,50,0.06)",
    spotlight: "rgba(15,120,70,0.08)",
  },
};
const ThemeContext = createContext(THEMES.night);
const useTheme = () => useContext(ThemeContext);

/* ============================
   Animation Variants
   ============================ */
const containerStagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.1 } } };
const cardFade = (direction = "up", delay = 0) => ({
  hidden: { opacity: 0, y: direction === "up" ? 24 : direction === "down" ? -24 : 0, x: direction === "left" ? 24 : direction === "right" ? -24 : 0 },
  show: { opacity: 1, y: 0, x: 0, transition: { type: "spring", stiffness: 90, damping: 16, mass: 0.6, delay } },
});
const navFade = { hidden: { y: -24, opacity: 0 }, show: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } } };

/* ============================
   CONTENT
   ============================ */
const QUICK_PROOF = [
  { icon: <Layers size={17} />, value: "5+ End-to-End Pipelines", key: "blue" },
  { icon: <Award size={17} />, value: "Databricks + SQL + GenAI", key: "green" },
  { icon: <Brain size={17} />, value: "DE • ML • MLOps • GenAI", key: "pink" },
];

const WHAT_I_BRING = [
  "End-to-end pipeline development: ingestion → transformation → curated datasets → analytics + ML outputs.",
  "Strong SQL & data modeling mindset (schema design, partitioning, format choices, performance).",
  "Cloud-native stack: Azure (ADF/ADLS/Blob) + Databricks + Snowflake + dbt + MLflow.",
  "ML integration: feature engineering pipelines, model deployment on Databricks, experiment tracking.",
  "GenAI exploration: LLM workflows, RAG pipelines, and prompt engineering.",
  "Quality-first: schema enforcement, clean layers, reproducible runs, orchestration-ready design.",
];

const EXPERIENCE = [
  {
    role: "Data Engineer",
    company: "Nagarro",
    location: "Gurugram",
    period: "Jul 2025 – Present",
    start: "2025-07-01", end: null,
    status: "ACTIVE",
    key: "green",
    bullets: [
      "Designed and developed scalable data pipelines using Azure Synapse and Snowflake, enabling efficient ingestion and transformation of large-scale structured data.",
      "Implemented dbt-based transformation layers for staging and marts, ensuring modular, testable, and analytics-ready data models with strong data quality checks.",
    ],
    tech: ["Azure Synapse", "Snowflake", "dbt", "Apache Airflow", "SQL"],
  },
  {
    role: "Cloud and DevOps Intern",
    company: "Canara HSBC Life Insurance Company",
    location: "Gurugram",
    period: "Jul 2024 – Aug 2024",
    start: "2024-07-01", end: "2024-08-31",
    status: "COMPLETED",
    key: "blue",
    bullets: [
      "Built and automated CI/CD pipelines using Jenkins and Docker, streamlining deployments and environment setup.",
      "Built and configured a secure AWS Virtual Private Cloud (VPC) and managed AWS cloud services (EC2, S3) for infrastructure and storage, improving scalability, reliability, and operational efficiency.",
    ],
    tech: ["Jenkins", "Docker", "AWS EC2", "AWS S3", "VPC"],
  },
];

const SKILLS = [
  { name: "Python", proficiency: "Intermediate", description: "ETL scripting + ML + data processing", key: "green", category: "core" },
  { name: "SQL", proficiency: "Advanced", description: "Joins, windows, modeling, optimization", key: "blue", category: "core", current: true },
  { name: "Java", proficiency: "Intermediate", description: "Core language fundamentals", key: "amber", category: "core" },
  { name: "PySpark", proficiency: "Intermediate", description: "DataFrames, transformations, partitions", key: "amber", category: "data" },
  { name: "Microsoft Azure", proficiency: "Intermediate", description: "Synapse, ADF, ADLS, Blob", key: "blue", category: "cloud", current: true },
  { name: "Databricks", proficiency: "Intermediate", description: "Notebooks, jobs, MLflow, cluster workflows", key: "pink", category: "data" },
  { name: "Snowflake", proficiency: "Intermediate", description: "Warehousing + analytics queries", key: "blue", category: "data", current: true },
  { name: "dbt", proficiency: "Intermediate", description: "Staging + marts, tests, docs, ELT patterns", key: "pink", category: "data", current: true },
  { name: "AWS", proficiency: "Intermediate", description: "EC2, S3 for infra + storage", key: "amber", category: "cloud" },
  { name: "Docker", proficiency: "Intermediate", description: "Containerized deployments", key: "blue", category: "devops" },
  { name: "Jenkins", proficiency: "Intermediate", description: "CI/CD pipeline automation", key: "pink", category: "devops" },
  { name: "Airflow", proficiency: "Intermediate", description: "Workflow orchestration", key: "amber", category: "data", current: true },
  { name: "MLflow", proficiency: "Intermediate", description: "Experiment tracking, model registry", key: "amber", category: "ml" },
  { name: "MLOps", proficiency: "Learning", description: "CI/CD for ML, model monitoring", key: "blue", category: "ml" },
  { name: "Generative AI", proficiency: "Exploring", description: "LLMs, RAG, prompt eng.", key: "pink", category: "genai" },
  { name: "Vector Databases", proficiency: "Exploring", description: "Embeddings + similarity search for RAG", key: "blue", category: "genai" },
  { name: "AI Agents", proficiency: "Exploring", description: "Agentic AI workflows + tool use", key: "pink", category: "genai" },
  { name: "Delta Lake", proficiency: "Intermediate", description: "Lakehouse concepts + ACID basics", key: "green", category: "data" },
];

/* Proficiency is shown as a qualitative tier (no invented precision like "92%"). */
const PROFICIENCY_TIERS = { Advanced: 4, Intermediate: 3, Learning: 2, Exploring: 1 };

const SKILL_CATEGORIES = [
  { id: "all", label: "all" }, { id: "core", label: "core" }, { id: "data", label: "data-eng" },
  { id: "cloud", label: "cloud" }, { id: "devops", label: "devops" }, { id: "ml", label: "ml/mlops" }, { id: "genai", label: "genai" },
];

/* Real brand logos where devicon has verified coverage; niche data tools
   (Databricks, Snowflake, dbt, MLflow, Delta Lake) fall back to a colored
   lucide glyph so nothing risks a broken image. */
const PRIMARY_INSTRUMENTS = [
  { name: "Python", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "Azure", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg" },
  { name: "SQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
  { name: "Databricks", icon: <Database size={26} />, key: "pink" },
  { name: "Snowflake", icon: <Cloud size={26} />, key: "blue" },
  { name: "dbt", icon: <Workflow size={26} />, key: "amber" },
  { name: "MLflow", icon: <Brain size={26} />, key: "green" },
  { name: "Apache Airflow", icon: <Zap size={26} />, key: "blue" },
];

const CAPABILITIES = [
  {
    code: "OFR.01", title: "Pipeline Engineering",
    desc: "I design ingestion-to-serving pipelines with clear RAW/CLEAN/ERROR layering, reconciliation checks, and orchestration-ready structure — so downstream analytics can actually be trusted.",
    key: "green",
  },
  {
    code: "OFR.02", title: "Cloud Data Platforms",
    desc: "Hands-on with Azure (ADF, ADLS, Blob), Databricks, Snowflake, and dbt — building warehouses and lakehouses that scale cleanly from prototype to production.",
    key: "blue",
  },
  {
    code: "OFR.03", title: "ML & GenAI Enablement",
    desc: "I extend pipelines into ML territory: feature engineering, MLflow experiment tracking, and RAG/GenAI workflows for smarter, LLM-assisted data systems.",
    key: "pink",
  },
];

const PROJECTS = [
  {
    title: "End-to-End Data Engineering Pipeline",
    subtitle: "Azure Synapse + Snowflake + dbt",
    duration: "Self-Project", client: "Personal Development", tag: "Data Engineering",
    problem: "Manual ingestion and inconsistent validation lead to unreliable analytics. Teams need automated pipelines with clean/error separation and tested transformations.",
    objective: "Build an event-driven, production-style pipeline that ingests CSV files from ADLS Gen2, loads RAW data into Snowflake, separates CLEAN/ERROR records, and builds analytics-ready marts using dbt with tests.",
    approach: [
      "Storage Event Trigger to automatically detect new files in ADLS Gen2",
      "Dynamic Synapse pipeline using Get Metadata + ForEach for file iteration",
      "Copy Activity to load each file into Snowflake RAW tables",
      "Validation logic to split records into CLEAN and ERROR layers with reconciliation",
      "dbt models (staging → marts) with tests for data quality and business rules",
    ],
    impact: [
      "Implemented RAW/CLEAN/ERROR layering in Snowflake for reliable downstream analytics",
      "Automated ingestion with event-based trigger + dynamic file processing",
      "Designed a validation framework ensuring 100% data reconciliation between RAW and CLEAN + ERROR tables",
      "Built analytics-ready fact tables with dbt + tests to validate data quality",
    ],
    architecture: ["ADLS Gen2 (CSV)", "Synapse Pipelines", "Snowflake RAW/CLEAN/ERROR", "dbt marts + tests"],
    tech: ["Azure Synapse", "ADLS Gen2", "Snowflake", "dbt", "SQL"],
    repo: "https://github.com/parthhhhh12/-end-to-end-data-engineering-azure-synapse-snowflake.git",
  },
  {
    title: "Batch ETL Pipeline on Azure Databricks",
    subtitle: "NYC Taxi – 1M+ trip records",
    duration: "Self-Project", client: "Personal Development", tag: "Big Data",
    problem: "Raw NYC Taxi trip data is large, messy, and not directly usable for analytics. BI needs clean, typed, aggregated tables.",
    objective: "Build a scalable batch ETL pipeline that produces clean + analytics-ready datasets and vendor-level daily aggregates.",
    approach: [
      "Ingest raw NYC Taxi data from Azure Blob Storage",
      "Clean + enforce schema (type casting, null handling, filtering)",
      "Transform into curated layers (raw → cleaned → aggregated)",
      "Write output in Parquet for fast querying + BI integration",
    ],
    impact: [
      "Processed 1M+ NYC Taxi trip records using PySpark on Azure Databricks",
      "Improved data quality by 30% through type casting, filtering invalid rows, and daily vendor-level aggregations",
      "Enhanced query performance by 40% by storing processed outputs in Parquet on Azure Blob Storage",
    ],
    architecture: ["Azure Blob (raw)", "Databricks PySpark ETL", "Curated Parquet", "BI / Analytics"],
    tech: ["Azure Databricks", "PySpark", "Azure Blob Storage", "Parquet"],
    repo: "https://github.com/parthhhhh12/Data_Engineering_Personal_Project",
  },
];

const TIMELINE = [
  { year: "2024", title: "Started Data Engineering Journey", desc: "Dove deep into SQL, Python, and cloud fundamentals on Azure.", key: "blue" },
  { year: "2025", title: "Built First Production Pipelines", desc: "Hands-on with PySpark, Databricks, Snowflake, dbt — end-to-end.", key: "green" },
  { year: "2025", title: "Databricks Certifications", desc: "Earned Data Engineer Associate + Generative AI Engineer Associate.", key: "amber" },
  { year: "2026", title: "ML & DataOps Integration", desc: "Extended pipelines into ML — feature stores, MLflow, model registry.", key: "green" },
  { year: "2026", title: "Exploring Generative AI", desc: "RAG pipelines, LLM integration in data workflows.", key: "pink" },
];

const CONSOLE_LINES = [
  { kind: "cmd", text: "$ ./run_pipeline.sh --target=parth-profile" },
  { kind: "log", text: "[01·INGEST]    loading profile.yaml ............ OK" },
  { kind: "log", text: "[02·SCHEMA]    validating 12 skills .............. OK" },
  { kind: "log", text: "[03·TRANSFORM] compiling 5 case studies ......... OK" },
  { kind: "log", text: "[04·LOAD]      publishing portfolio ............. OK" },
  { kind: "log", text: "[05·VALIDATE]  checking 4 certifications ........ OK" },
  { kind: "success", text: "✓ pipeline completed in 0.87s — 0 errors, 0 warnings" },
];

const BOOT_LINES = [
  "booting parth.os v2.6 ...",
  "mounting /skills /projects /experience ...",
  "spinning up render engine ...",
  "linking cursor.exe ...",
  "ready.",
];

/* ============================
   Magnetic word-zoom text
   Each word scales up as the cursor nears it.
   ============================ */
const DEFAULT_ZOOM_RADIUS = 110;

/* One shared mousemove listener drives every zoomable word on the page —
   far cheaper than each text block running its own listener. Words register
   themselves via the ".zword" class; radius/scale are read per-word from
   data attributes so headings can zoom more than body copy. */
function useGlobalWordZoom() {
  useEffect(() => {
    let raf = null;
    let nodes = [];
    const requery = () => { nodes = Array.from(document.querySelectorAll(".zword")); };
    requery();
    const interval = setInterval(requery, 1200);
    const onMove = (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const vh = window.innerHeight;
        for (let i = 0; i < nodes.length; i++) {
          const w = nodes[i];
          const rect = w.getBoundingClientRect();
          if (rect.bottom < -150 || rect.top > vh + 150) continue;
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
          const radius = Number(w.dataset.zr) || DEFAULT_ZOOM_RADIUS;
          const maxScale = Number(w.dataset.zs) || 1.3;
          const scale = dist < radius ? 1 + (maxScale - 1) * (1 - dist / radius) : 1;
          w.style.transform = scale <= 1.001 ? "" : `scale(${scale.toFixed(3)})`;
        }
      });
    };
    const onScroll = () => { nodes.forEach((w) => { w.style.transform = ""; }); };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      clearInterval(interval);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
}

/* Centered word-zoom for short standalone text: hero name, nav brand, stage titles. */
function ZoomText({ text, as: Tag = "span", className, style, radius = 130, maxScale = 1.45 }) {
  const words = text.split(" ");
  return (
    <Tag className={className} style={{ ...style, display: "inline-flex", flexWrap: "wrap", justifyContent: "center" }}>
      {words.map((w, i) => (
        <span
          key={i}
          className="zword"
          data-zr={radius} data-zs={maxScale}
          style={{ display: "inline-block", transition: "transform 0.18s cubic-bezier(0.2,0.8,0.2,1)", transformOrigin: "center", willChange: "transform", padding: "0 0.08em" }}
        >
          {w}
        </span>
      ))}
    </Tag>
  );
}

/* Cursor-reactive body text WITHOUT any scale/transform — this is what
   replaced the old word-zoom-on-paragraphs approach, which scaled multiple
   tightly-packed neighboring words at once and made them visually overlap.
   Instead: a duplicate text layer in an accent color is masked to a soft
   circle that follows the cursor, so nearby words brighten/"light up" but
   never move, resize, or collide with their neighbors. */
function GlowText({ text, as: Tag = "p", className, style, radius = 90, glowColor }) {
  const theme = useTheme();
  const ref = useRef(null);
  const color = glowColor || theme.green;

  const handleMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--tx", `${e.clientX - rect.left}px`);
    ref.current.style.setProperty("--ty", `${e.clientY - rect.top}px`);
  };
  const reset = () => {
    if (!ref.current) return;
    ref.current.style.setProperty("--tx", "-999px");
    ref.current.style.setProperty("--ty", "-999px");
  };

  return (
    <Tag
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={className}
      style={{ ...style, position: "relative", display: "block", "--glow-radius": `${radius}px` }}
    >
      {text}
      <span className="text-glow-overlay" aria-hidden="true" style={{ color }}>{text}</span>
    </Tag>
  );
}

/* ============================
   Magnetic button — pulls toward cursor
   ============================ */
function MagneticButton({ children, className, style, onClick, as = "button", href, target, rel, strength = 0.35 }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    setPos({ x, y });
  };
  const reset = () => setPos({ x: 0, y: 0 });
  const Comp = as === "a" ? motion.a : motion.button;
  return (
    <Comp
      ref={ref}
      href={href} target={target} rel={rel}
      onMouseMove={handleMove} onMouseLeave={reset} onClick={onClick}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 200, damping: 14, mass: 0.4 }}
      className={className} style={style}
    >
      {children}
    </Comp>
  );
}

/* ============================
   Tilt wrapper — 3D perspective tilt on hover
   ============================ */
function TiltCard({ children, className, style }) {
  const ref = useRef(null);
  const [transform, setTransform] = useState("perspective(900px) rotateX(0deg) rotateY(0deg)");
  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTransform(`perspective(900px) rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 8).toFixed(2)}deg)`);
  };
  const reset = () => setTransform("perspective(900px) rotateX(0deg) rotateY(0deg)");
  return (
    <div
      ref={ref} onMouseMove={handleMove} onMouseLeave={reset}
      className={className} style={{ ...style, transform, transition: "transform 0.25s ease-out" }}
    >
      {children}
    </div>
  );
}

/* ============================
   Spotlight mouse-tracked glow on card hover
   ============================ */
function useSpotlight() {
  return {
    onMouseMove: (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
    },
  };
}

/* ============================
   Boot sequence intro overlay
   ============================ */
function BootSequence({ onDone }) {
  const theme = useTheme();
  const [visible, setVisible] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (visible < BOOT_LINES.length) {
      const t = setTimeout(() => setVisible(v => v + 1), 260);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => finish(), 450);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const finish = () => { setLeaving(true); setTimeout(onDone, 500); };

  return (
    <motion.div
      className="fixed inset-0 z-[9998] flex items-center justify-center px-6 cursor-pointer"
      style={{ background: theme.bg }}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: 0.45 }}
      onClick={finish}
    >
      <div className="w-full max-w-md font-mono text-sm">
        {BOOT_LINES.slice(0, visible).map((l, i) => (
          <div key={i} className="mb-1.5" style={{ color: i === BOOT_LINES.length - 1 ? theme.green : theme.textSecondary }}>
            <span style={{ color: theme.textMuted }}>[{String(i).padStart(2, "0")}]</span> {l}
          </div>
        ))}
        <span className="inline-block w-2 h-4 align-middle animate-pulse" style={{ background: theme.green }} />
        <div className="mt-6 text-xs" style={{ color: theme.textMuted }}>click anywhere to skip</div>
      </div>
    </motion.div>
  );
}

/* ============================
   Command palette (⌘K)
   ============================ */
function CommandPalette({ open, onClose, onNavigate, onToggleTheme, isDark }) {
  const theme = useTheme();
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => { if (open) { setQuery(""); setTimeout(() => inputRef.current?.focus(), 50); } }, [open]);

  const commands = useMemo(() => ([
    ...STAGES.map(s => ({ id: s.id, label: `Go to ${s.label.toLowerCase()}`, hint: `stage ${s.code}`, action: () => onNavigate(s.id) })),
    { id: "theme", label: `Switch to ${isDark ? "day" : "night"} mode`, hint: "toggle", action: onToggleTheme },
    { id: "email", label: "Copy email address", hint: "clipboard", action: () => navigator.clipboard?.writeText("parthsingh1253@gmail.com") },
    { id: "github", label: "Open GitHub profile", hint: "external", action: () => window.open("https://github.com/parthhhhh12", "_blank") },
    { id: "linkedin", label: "Open LinkedIn profile", hint: "external", action: () => window.open("https://www.linkedin.com/in/singh05e/", "_blank") },
    { id: "resume", label: "Download resume", hint: "pdf", action: () => window.open("/Data_and_AI_Resume.pdf", "_blank") },
    { id: "print", label: "Print / save this page as PDF", hint: "export", action: () => window.print() },
  ]), [isDark, onNavigate, onToggleTheme]);

  const filtered = commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));
  const run = (cmd) => { cmd.action(); onClose(); };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter" && filtered[0]) run(filtered[0]);
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, filtered]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[997]" style={{ background: "rgba(0,0,0,0.6)" }} onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: -14, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -14, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="fixed top-[14vh] left-1/2 -translate-x-1/2 w-[92vw] max-w-lg z-[998] rounded-2xl border overflow-hidden font-mono"
            style={{ background: theme.navBg, borderColor: theme.cardBorder, backdropFilter: "blur(20px)", boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}
          >
            <div className="flex items-center gap-2.5 px-4 py-3 border-b" style={{ borderColor: theme.cardBorder }}>
              <Search size={15} style={{ color: theme.textMuted }} />
              <input
                ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="type a command..."
                className="flex-1 bg-transparent outline-none text-sm" style={{ color: theme.text }}
              />
              <kbd className="text-[10px] px-1.5 py-0.5 rounded border" style={{ borderColor: theme.cardBorder, color: theme.textMuted }}>esc</kbd>
            </div>
            <div className="max-h-72 overflow-y-auto py-1.5">
              {filtered.length === 0 && <div className="px-4 py-4 text-sm" style={{ color: theme.textMuted }}>no matches</div>}
              {filtered.map((c, i) => (
                <button
                  key={c.id} onClick={() => run(c)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left hover:bg-white/5 transition-colors"
                  style={{ color: i === 0 ? theme.green : theme.text }}
                >
                  <span>{c.label}</span>
                  <span className="text-[11px] uppercase tracking-wider" style={{ color: theme.textMuted }}>{c.hint}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ============================
   Portfolio chatbot — natural-language FAQ assistant over the site's own
   data. This is intentionally NOT a wired-up LLM: shipping a real AI chat
   here would require a backend to hide an API key (client-side code can
   never keep a key secret), which is out of scope for a static portfolio
   and would be one more thing that can break in production. Instead this
   is an honest, clearly-labeled rule-based assistant — keyword/intent
   matching against SKILLS/EXPERIENCE/PROJECTS/CAPABILITIES, so every
   answer stays in sync with the rest of the site by construction.
   ============================ */
const CHAT_QUICK_QUESTIONS = [
  "What are your skills?",
  "Do you know Python?",
  "Tell me about your experience",
  "Show me a project",
  "How can I hire you?",
];

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/* Short/common words that risk being an accidental substring of an unrelated
   word (yo -> "your", hi -> "hire"/"this", hey -> "they", sup -> "support",
   rag -> "storage", job -> "enjoy", pay -> "company") get EXACT whole-word
   matching. Everything else is prefix-matched so stems like "skill"/
   "project"/"intern"/"certificat" still catch "skills"/"projects"/
   "internship"/"certification" — this was tested and tuned against real
   phrasing, not just guessed at. */
const CHAT_EXACT_WORDS = new Set(["hi", "yo", "hey", "sup", "rag", "job", "pay"]);
function keywordHits(text, kw) {
  const pattern = CHAT_EXACT_WORDS.has(kw) ? `\\b${escapeRegExp(kw)}\\b` : `\\b${escapeRegExp(kw)}`;
  return new RegExp(pattern).test(text);
}

/* Aliases so recruiters can ask about specific tools/companies using
   whatever shorthand they actually type — these map onto the exact
   SKILLS / EXPERIENCE entries, so proficiency levels always stay accurate. */
const SKILL_ALIASES = {
  "gen ai": "Generative AI", "genai": "Generative AI", "spark": "PySpark",
  "azure": "Microsoft Azure", "ms azure": "Microsoft Azure",
  "vector db": "Vector Databases", "vector dbs": "Vector Databases", "agentic ai": "AI Agents",
  "apache airflow": "Airflow",
};
const PROJECT_ALIASES = [
  ["synapse pipeline", "snowflake pipeline", "reconciliation", "raw clean error", "adls", "dbt pipeline", "synapse project"],
  ["taxi", "nyc taxi", "databricks etl", "batch etl", "spark etl", "databricks project"],
];
const EXPERIENCE_ALIASES = [["nagarro"], ["canara", "hsbc", "devops intern", "cloud intern"]];

/* Pre-trained knowledge base — every recognized topic about Parth's
   profile, built as a *layered* matcher rather than one flat keyword list:
   1) specific skill/project/company mentions are resolved first, straight
      from SKILLS/PROJECTS/EXPERIENCE — this alone covers all skills,
      both case studies, and both jobs individually, and can never drift
      out of sync with the rest of the site since it reads the same arrays.
   2) broader FAQ intents (below) catch everything else — greetings,
      general "what are your skills" style questions, hiring, salary,
      notice period, why-hire-him, growth areas, meta questions about the
      bot itself, and a polite decline for anything outside scope. */
function findSkillMention(text) {
  const sorted = [...SKILLS].sort((a, b) => b.name.length - a.name.length);
  for (const s of sorted) {
    if (new RegExp(`\\b${escapeRegExp(s.name.toLowerCase())}\\b`).test(text)) return s;
  }
  for (const [alias, name] of Object.entries(SKILL_ALIASES)) {
    if (new RegExp(`\\b${escapeRegExp(alias)}\\b`).test(text)) return SKILLS.find((s) => s.name === name);
  }
  return null;
}
function findProjectMention(text) {
  for (let i = 0; i < PROJECTS.length; i++) {
    for (const alias of PROJECT_ALIASES[i] || []) {
      if (new RegExp(`\\b${escapeRegExp(alias)}`).test(text)) return PROJECTS[i];
    }
  }
  return null;
}
function findExperienceMention(text) {
  for (let i = 0; i < EXPERIENCE.length; i++) {
    for (const alias of EXPERIENCE_ALIASES[i] || []) {
      if (new RegExp(`\\b${escapeRegExp(alias)}\\b`).test(text)) return EXPERIENCE[i];
    }
  }
  return null;
}

/* Real date arithmetic, not string guessing — "period" text like "Jul 2025 –
   Present" stays purely for display; start/end fields on EXPERIENCE drive
   every numeric answer, so duration questions get an exact answer that also
   stays correct automatically as real time passes (no annual manual edits). */
function jobDurationMonths(job) {
  const start = new Date(job.start);
  const end = job.end ? new Date(job.end) : new Date();
  let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  if (end.getDate() < start.getDate()) months -= 1;
  return Math.max(months, 0);
}
function formatMonths(totalMonths) {
  if (totalMonths < 1) return "less than a month";
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const parts = [];
  if (years > 0) parts.push(`${years} year${years !== 1 ? "s" : ""}`);
  if (months > 0) parts.push(`${months} month${months !== 1 ? "s" : ""}`);
  return parts.join(" ");
}
/* A question counts as "numeric" if it's fishing for a count/duration —
   "how many years", "how long", "in years", "duration", "tenure", etc. —
   as opposed to "tell me about" style questions, which still get the
   full descriptive answer. */
const DURATION_QUESTION_RE = /\bhow (many|much|long)\b|\bin (years|months)\b|\bduration\b|\btenure\b/;

const CHAT_INTENTS = [
  {
    id: "greeting",
    keywords: ["hi", "hello", "hey", "yo", "sup", "greetings"],
    response: () => "Hey! I'm Parth's portfolio assistant. Ask me about his skills, work experience, projects, certifications, or how to get in touch.",
  },
  {
    id: "skills",
    keywords: ["skill", "tech stack", "technologies", "tools", "stack", "know", "proficient", "language", "programming"],
    response: () => {
      const top = SKILLS.filter((s) => s.proficiency === "Advanced" || s.current).slice(0, 6);
      return `Parth's core stack:\n${top.map((s) => `- ${s.name} (${s.proficiency})`).join("\n")}\n\nAsk about any specific tool (e.g. "do you know Docker?") for detail, or see the SCHEMA section above.`;
    },
  },
  {
    id: "experience",
    keywords: ["experience", "work history", "job", "career", "background", "resume history"],
    response: () => `Parth's work history:\n${EXPERIENCE.map((e) => `- ${e.role} @ ${e.company} (${e.period})`).join("\n")}\n\nHe's currently shipping data pipelines at Nagarro. Ask about a specific company for more detail.`,
  },
  {
    id: "role",
    keywords: ["job title", "his role", "his title", "what does he do", "current position", "what kind of engineer", "what is his role", "what is he", "current role"],
    response: () => {
      const primary = EXPERIENCE.find((e) => e.status === "ACTIVE") || EXPERIENCE[0];
      return `Parth's current title is ${primary.role} at ${primary.company}. He builds data pipelines and cloud data platforms, and is extending into ML/GenAI.`;
    },
  },
  {
    id: "years",
    keywords: ["how many years", "years of experience", "fresher", "experience level", "senior or junior"],
    response: () => {
      const primary = EXPERIENCE.find((e) => e.status === "ACTIVE") || EXPERIENCE[0];
      const intern = EXPERIENCE.find((e) => e.status !== "ACTIVE");
      const primaryDur = formatMonths(jobDurationMonths(primary));
      const internDur = intern ? formatMonths(jobDurationMonths(intern)) : null;
      return `About ${primaryDur} of full-time experience as a ${primary.role} at ${primary.company} (since ${primary.period.split(" – ")[0]})` +
        (internDur ? `, plus a ${internDur} Cloud & DevOps internship at Canara HSBC in 2024.` : ".");
    },
  },
  {
    id: "projects",
    keywords: ["project", "built", "case study", "github", "repo", "portfolio piece"],
    response: () => `Featured projects:\n${PROJECTS.map((p) => `- ${p.title} — ${p.subtitle}`).join("\n")}\n\nAsk about a specific one (e.g. "tell me about the taxi project") for the full write-up.`,
    actions: [{ label: "View GitHub", type: "link", href: "https://github.com/parthhhhh12" }],
  },
  {
    id: "offer",
    keywords: ["offer", "capabilit", "provide", "help with", "specializ", "why should", "why hire", "why you", "makes you", "makes him", "strength"],
    response: () => `Why Parth:\n${CAPABILITIES.map((c) => `- ${c.title}: ${c.desc.split(".")[0]}.`).join("\n")}`,
  },
  {
    id: "growth",
    keywords: ["weakness", "still learning", "growth area", "improve", "gaps"],
    response: () => {
      const growing = SKILLS.filter((s) => s.proficiency === "Learning" || s.proficiency === "Exploring");
      return `Honestly: he's upfront about where he's still building depth —\n${growing.map((s) => `- ${s.name} (${s.proficiency})`).join("\n")}\n\nEverything else on the stack is Intermediate or Advanced.`;
    },
  },
  {
    id: "certifications",
    keywords: ["certificat", "certified", "credential", "databricks cert", "hackerrank"],
    response: () => "Certifications:\n- Databricks Certified Data Engineer Associate\n- Databricks Certified Generative AI Engineer Associate\n- HackerRank SQL Advanced",
  },
  {
    id: "education",
    keywords: ["education", "degree", "college", "university", "study", "upes", "grade", "gpa", "cgpa"],
    response: () => "B.Tech in Computer Science Engineering, University of Petroleum and Energy Studies, Dehradun (Aug 2021 – Jun 2025) — specialization in Cloud Computing and DevOps, Grade A.",
  },
  {
    id: "genai",
    keywords: ["genai", "generative ai", "rag", "llm", "agent", "vector database", "ai agent"],
    response: () => "Parth is extending his data pipelines into GenAI territory — RAG pipelines, vector databases, and early AI-agent workflows. Still hands-on and actively growing here.",
  },
  {
    id: "location",
    keywords: ["location", "where is he", "based", "city", "remote", "onsite"],
    response: () => "Based in Gurugram, Haryana, India.",
  },
  {
    id: "hire",
    keywords: ["hire", "available", "opportunit", "job opening", "recruit", "open to work", "position"],
    response: () => "Parth is open to new opportunities in data engineering and AI/ML. Best next step: drop him an email or grab his resume.",
    actions: [{ label: "Copy Email", type: "email" }, { label: "Get Resume", type: "resume" }],
  },
  {
    id: "notice",
    keywords: ["notice period", "when can you join", "when can he join", "when can he start", "when could he start", "start date", "availability date"],
    response: () => "Best discussed directly with Parth — reach out and he'll share his current availability.",
    actions: [{ label: "Copy Email", type: "email" }],
  },
  {
    id: "salary",
    keywords: ["salary", "rate", "compensation", "pay", "cost to hire", "does he cost", "ctc"],
    response: () => "That's best discussed directly — reach out and Parth will get back to you.",
    actions: [{ label: "Copy Email", type: "email" }],
  },
  {
    id: "resume",
    keywords: ["resume", "cv", "download resume"],
    response: () => "Here's Parth's resume:",
    actions: [{ label: "Get Resume", type: "resume" }],
  },
  {
    id: "contact",
    keywords: ["contact", "email", "reach", "linkedin", "connect", "get in touch"],
    response: () => "You can reach Parth directly:",
    actions: [{ label: "Copy Email", type: "email" }, { label: "LinkedIn", type: "link", href: "https://www.linkedin.com/in/singh05e/" }, { label: "GitHub", type: "link", href: "https://github.com/parthhhhh12" }],
  },
  {
    id: "theme",
    keywords: ["theme", "dark mode", "light mode", "dark theme", "light theme"],
    response: () => "Switched the theme for you — check the top-right toggle!",
  },
  {
    id: "meta",
    keywords: ["who built this", "who made this", "are you real", "are you ai", "real ai", "chatbot", "are you a bot"],
    response: () => "I'm a rule-based FAQ assistant built by Parth as part of this portfolio — not a live LLM connection. I answer from his real skills/experience/projects data, so nothing here is made up.",
  },
  {
    id: "personal",
    keywords: ["hobby", "hobbies", "favorite", "favourite", "fun fact", "weekend", "personal life"],
    response: () => "I'm scoped to Parth's professional profile, so I don't have that — try asking about his skills, experience, or projects instead!",
  },
  {
    id: "thanks",
    keywords: ["thank", "thanks", "appreciate", "cool", "nice one", "awesome"],
    response: () => "Anytime! Let me know if there's anything else you'd like to know about Parth's work.",
  },
];

/* Detects "is he/Parth a/an X" identity questions — the single most obvious
   question a recruiter asks ("is Parth a data engineer?") and the one the
   entity/keyword lookups below don't cover on their own, since "data
   engineer" is a job title, not a skill name or company. */
const ROLE_TRUE = ["data engineer", "ai data engineer", "data and ai engineer", "cloud engineer", "pipeline engineer", "dataops engineer"];
const ROLE_PARTIAL = ["ai engineer", "ml engineer", "machine learning engineer", "genai engineer", "devops engineer", "cloud and devops engineer"];
function detectRoleQuestion(text) {
  const m = text.match(/\bis\s+(?:he|parth)\s+an?\s+([a-z][a-z\s-]*?)\s*\??$/);
  return m ? m[1].trim() : null;
}

function matchChatIntent(input) {
  const text = input.toLowerCase();
  const isDurationQuestion = DURATION_QUESTION_RE.test(text);

  const roleQuestion = detectRoleQuestion(text);
  if (roleQuestion) {
    const primary = EXPERIENCE.find((e) => e.status === "ACTIVE") || EXPERIENCE[0];
    if (ROLE_TRUE.some((r) => roleQuestion.includes(r))) {
      return { text: `Yes — Parth is a ${primary.role} at ${primary.company}.`, actions: [], intentId: "role-lookup" };
    }
    if (ROLE_PARTIAL.some((r) => roleQuestion.includes(r))) {
      return { text: `Not his exact job title, but close — he's a ${primary.role} who also works hands-on with ML and GenAI.`, actions: [], intentId: "role-lookup" };
    }
    return { text: `Not quite — his current title is ${primary.role} at ${primary.company}, focused on data pipelines and cloud platforms.`, actions: [], intentId: "role-lookup" };
  }

  const expHit = findExperienceMention(text);

  if (expHit && isDurationQuestion) {
    const dur = formatMonths(jobDurationMonths(expHit));
    return {
      text: `Parth has been at ${expHit.company} for ${dur} — ${expHit.role} (${expHit.period}).`,
      actions: [],
      intentId: "duration-lookup",
    };
  }

  if (!expHit && isDurationQuestion && /\b(experience|company|companies|tenure|job|work|nagarro|canara|hsbc)\b/.test(text)) {
    const lines = EXPERIENCE.map((e) => `- ${e.company}: ${formatMonths(jobDurationMonths(e))} (${e.period})`);
    const primary = EXPERIENCE.find((e) => e.status === "ACTIVE") || EXPERIENCE[0];
    return {
      text: `Company tenure:\n${lines.join("\n")}\n\nTotal full-time experience: ${formatMonths(jobDurationMonths(primary))}.`,
      actions: [],
      intentId: "duration-lookup",
    };
  }

  const skillHit = findSkillMention(text);
  if (skillHit) {
    const note = skillHit.current ? " He's actively using it right now at Nagarro." : "";
    return { text: `Yes — ${skillHit.name}: ${skillHit.proficiency} proficiency.\n${skillHit.description}.${note}`, actions: [], intentId: "skill-lookup" };
  }
  const projectHit = findProjectMention(text);
  if (projectHit) {
    return {
      text: `${projectHit.title}\n${projectHit.subtitle}\n\nProblem: ${projectHit.problem}\n\nImpact:\n${projectHit.impact.map((x) => `- ${x}`).join("\n")}`,
      actions: [{ label: "View GitHub", type: "link", href: projectHit.repo }],
      intentId: "project-lookup",
    };
  }
  if (expHit) {
    return {
      text: `${expHit.role} @ ${expHit.company} (${expHit.period})\n${expHit.bullets.map((b) => `- ${b}`).join("\n")}`,
      actions: [],
      intentId: "experience-lookup",
    };
  }

  let best = null;
  let bestScore = 0;
  for (const intent of CHAT_INTENTS) {
    let score = 0;
    for (const kw of intent.keywords) {
      if (keywordHits(text, kw)) score += kw.split(" ").length;
    }
    if (score > bestScore) { bestScore = score; best = intent; }
  }
  if (!best) {
    return { text: "I'm not totally sure about that one — try asking about skills, experience, projects, certifications, or how to get in touch.", actions: [], intentId: null };
  }
  return { text: best.response(), actions: best.actions || [], intentId: best.id };
}

function TypingDots() {
  const theme = useTheme();
  return (
    <div className="flex items-center gap-1 px-3.5 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: theme.textMuted }}
          animate={{ y: [0, -4, 0] }} transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

function ChatBubble({ message, onAction }) {
  const theme = useTheme();
  const isUser = message.role === "user";
  const lines = message.text.split("\n");
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={isUser ? "flex justify-end mb-3" : "flex justify-start mb-3"}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mr-2" style={{ background: theme.green + "20", color: theme.green }}>
          <Bot size={14} />
        </div>
      )}
      <div className="max-w-[80%]">
        <div
          className="rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed font-mono"
          style={{
            background: isUser ? theme.green : theme.inputBg,
            color: isUser ? theme.onAccent : theme.textSecondary,
            border: isUser ? "none" : `1px solid ${theme.cardBorder}`,
            borderTopRightRadius: isUser ? 4 : 16,
            borderTopLeftRadius: isUser ? 16 : 4,
          }}
        >
          {lines.map((line, i) => (<div key={i}>{line}</div>))}
        </div>
        {message.actions && message.actions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {message.actions.map((a, i) => (
              <button
                key={i} onClick={() => onAction(a)}
                className="text-xs font-mono font-bold px-2.5 py-1 rounded-full border"
                style={{ borderColor: theme.green + "50", color: theme.green, background: theme.green + "10" }}
              >
                {a.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ChatBot({ onToggleTheme }) {
  const theme = useTheme();
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! I'm Parth's portfolio assistant. Ask me about his skills, experience, projects, or how to get in touch.", actions: [] },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleAction = (action) => {
    if (action.type === "link") window.open(action.href, "_blank");
    if (action.type === "resume") window.open("/Data_and_AI_Resume.pdf", "_blank");
    if (action.type === "email") {
      navigator.clipboard?.writeText("parthsingh1253@gmail.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const send = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((m) => [...m, { role: "user", text: trimmed, actions: [] }]);
    setInput("");
    setIsTyping(true);
    const delay = 500 + Math.random() * 500;
    setTimeout(() => {
      const result = matchChatIntent(trimmed);
      if (result.intentId === "theme") onToggleTheme();
      setMessages((m) => [...m, { role: "bot", text: result.text, actions: result.actions }]);
      setIsTyping(false);
    }, delay);
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") send(input); };

  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: theme.mode === "night" ? "rgba(5,9,8,0.85)" : "rgba(255,255,255,0.7)", borderColor: theme.cardBorder }}>
      <div className="flex items-center gap-2.5 px-4 py-3 border-b" style={{ borderColor: theme.cardBorder, background: "rgba(120,120,120,0.04)" }}>
        <div className="relative w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: theme.green + "20", color: theme.green }}>
          <Bot size={16} />
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2" style={{ background: theme.green, borderColor: theme.bg }} />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-bold font-mono truncate" style={{ color: theme.text }}>Portfolio Assistant</div>
          <div className="text-[11px] font-mono flex items-center gap-1.5" style={{ color: theme.textMuted }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0" style={{ background: theme.green }} /> online · answers about Parth
          </div>
        </div>
        {copied && <span className="ml-auto text-xs font-mono flex-shrink-0" style={{ color: theme.green }}>email copied ✓</span>}
      </div>

      <div ref={scrollRef} className="px-4 py-4 h-64 overflow-y-auto">
        {messages.map((m, i) => (<ChatBubble key={i} message={m} onAction={handleAction} />))}
        {isTyping && (
          <div className="flex justify-start mb-3">
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mr-2" style={{ background: theme.green + "20", color: theme.green }}>
              <Bot size={14} />
            </div>
            <div className="rounded-2xl" style={{ background: theme.inputBg, border: `1px solid ${theme.cardBorder}`, borderTopLeftRadius: 4 }}>
              <TypingDots />
            </div>
          </div>
        )}
      </div>

      <div className="px-4 pb-3 flex flex-wrap gap-1.5">
        {CHAT_QUICK_QUESTIONS.map((q) => (
          <button
            key={q} onClick={() => send(q)}
            className="text-xs font-mono px-2.5 py-1 rounded-full border"
            style={{ borderColor: theme.cardBorder, color: theme.textSecondary }}
          >
            {q}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 px-4 py-3 border-t" style={{ borderColor: theme.cardBorder }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about skills, experience, projects..."
          className="flex-1 bg-transparent outline-none text-sm font-mono min-w-0"
          style={{ color: theme.text }}
          spellCheck={false}
          autoComplete="off"
        />
        <button onClick={() => send(input)} className="p-2 rounded-lg flex-shrink-0" style={{ background: theme.green, color: theme.onAccent }} aria-label="Send message">
          <Send size={14} />
        </button>
      </div>
      <div className="px-4 pb-2 text-[10px] font-mono text-center" style={{ color: theme.textMuted }}>
        automated FAQ assistant — not a live connection to Parth
      </div>
    </div>
  );
}

/* ============================
   Theme toggle
   ============================ */
function ThemeToggle({ isDark, onToggle }) {
  return (
    <motion.button
      onClick={onToggle}
      className="relative flex items-center justify-center w-12 h-6 rounded-full border overflow-hidden flex-shrink-0"
      style={{
        background: isDark ? "linear-gradient(135deg,#0f1a15,#12261c)" : "linear-gradient(135deg,#dff2e4,#c9ecd6)",
        borderColor: isDark ? "rgba(61,220,132,0.35)" : "rgba(15,120,70,0.35)",
      }}
      whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
      aria-label="Toggle day/night theme"
    >
      <motion.div
        animate={{ x: isDark ? -10 : 10 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className="absolute rounded-full flex items-center justify-center shadow-lg"
        style={{ width: 18, height: 18, background: isDark ? "#3ddc84" : "#0f9a54" }}
      >
        {isDark ? <Moon size={10} className="text-black" /> : <Sun size={10} className="text-white" />}
      </motion.div>
    </motion.button>
  );
}

/* ============================
   Scroll progress bar
   ============================ */
function ScrollProgressBar({ progress }) {
  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-[60] bg-transparent" data-print-hide="true">
      <motion.div
        className="h-full"
        style={{ width: `${progress}%`, background: "linear-gradient(90deg, #3ddc84, #5eb1ef, #ef6f9e)" }}
        transition={{ duration: 0.1 }}
      />
    </div>
  );
}

/* ============================
   Pipeline progress rail (fixed, desktop only)
   ============================ */
function PipelineRail({ active, onJump }) {
  const theme = useTheme();
  const activeIdx = STAGES.findIndex(s => s.id === active);
  return (
    <div className="hidden xl:flex flex-col items-center fixed right-6 top-1/2 -translate-y-1/2 z-40 gap-0" data-print-hide="true">
      {STAGES.map((s, i) => {
        const isActive = s.id === active;
        const isPast = activeIdx > i;
        return (
          <div key={s.id} className="flex flex-col items-center">
            <motion.button
              onClick={() => onJump(s.id)}
              className="relative group flex items-center justify-center w-3.5 h-3.5 rounded-full border-2"
              style={{
                borderColor: isActive || isPast ? theme.green : "rgba(147,168,157,0.3)",
                background: isActive ? theme.green : isPast ? theme.green + "55" : "transparent",
                boxShadow: isActive ? `0 0 12px ${theme.green}` : "none",
              }}
              whileHover={{ scale: 1.3 }}
              aria-label={s.label}
            >
              <span
                className="absolute right-full mr-3 whitespace-nowrap text-xs font-mono tracking-wider px-2 py-1 rounded border opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{ background: theme.navBg, borderColor: theme.cardBorder, color: theme.text }}
              >
                {s.code} · {s.label}
              </span>
            </motion.button>
            {i < STAGES.length - 1 && (
              <div className="w-px h-8 my-0.5" style={{ background: isPast ? theme.green : "rgba(147,168,157,0.2)" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ============================
   Terminal console (hero signature)
   ============================ */
function PipelineConsole() {
  const theme = useTheme();
  const [visible, setVisible] = useState(0);
  useEffect(() => {
    let t;
    if (visible < CONSOLE_LINES.length) t = setTimeout(() => setVisible(v => v + 1), visible === 0 ? 500 : 450);
    else t = setTimeout(() => setVisible(0), 3200);
    return () => clearTimeout(t);
  }, [visible]);

  const colorFor = (kind) => kind === "cmd" ? theme.text : kind === "success" ? theme.green : theme.textSecondary;

  return (
    <div className="w-full max-w-xl mx-auto rounded-xl border overflow-hidden text-left font-mono"
      style={{ background: theme.mode === "night" ? "rgba(5,9,8,0.85)" : "rgba(255,255,255,0.7)", borderColor: theme.cardBorder, boxShadow: "0 20px 60px rgba(0,0,0,0.35)" }}>
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b" style={{ borderColor: theme.cardBorder, background: "rgba(120,120,120,0.04)" }}>
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: theme.red }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: theme.amber }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: theme.green }} />
        <span className="ml-3 text-xs" style={{ color: theme.textMuted }}>pipeline_run.log</span>
      </div>
      <div className="px-4 py-4 sm:px-5 sm:py-5 min-h-[190px] text-xs sm:text-sm leading-relaxed">
        {CONSOLE_LINES.slice(0, visible).map((l, i) => (
          <div key={i} style={{ color: colorFor(l.kind) }} className="whitespace-pre-wrap break-words">{l.text}</div>
        ))}
        {visible < CONSOLE_LINES.length && <span className="inline-block w-1.5 h-3.5 align-middle animate-pulse" style={{ background: theme.green }} />}
      </div>
    </div>
  );
}

/* ============================
   Live architecture diagram — Source -> Ingest -> Transform -> Warehouse -> Serve
   This is the one visual that immediately says "data engineer" rather than
   "generic developer" — animated flow particles travel each connector on loop.
   ============================ */
const ARCHITECTURE_FLOW = [
  { label: "Sources", icon: <Layers size={18} />, key: "textMuted" },
  { label: "Ingest", icon: <Cloud size={18} />, key: "blue" },
  { label: "Transform", icon: <Workflow size={18} />, key: "pink" },
  { label: "Warehouse", icon: <Database size={18} />, key: "green" },
  { label: "Serve", icon: <Sparkles size={18} />, key: "amber" },
];

function FlowNode({ icon, label, color }) {
  const theme = useTheme();
  return (
    <motion.div className="flex flex-col items-center gap-1.5 flex-shrink-0" whileHover={{ scale: 1.1 }}>
      <div
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center border"
        style={{ background: color + "18", borderColor: color + "45", color }}
      >
        {icon}
      </div>
      <span className="text-[9px] sm:text-xs font-mono uppercase tracking-wider text-center" style={{ color: theme.textMuted }}>{label}</span>
    </motion.div>
  );
}

function FlowConnector({ color }) {
  return (
    <div className="relative flex-1 h-px mx-1 sm:mx-2 min-w-[16px] rounded-full" style={{ background: color + "30" }}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute top-1/2 w-1.5 h-1.5 rounded-full"
          style={{ background: color, boxShadow: `0 0 6px ${color}`, marginTop: "-3px" }}
          animate={{ left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "linear", delay: i * 0.8 }}
        />
      ))}
    </div>
  );
}

function ArchitectureDiagram() {
  const theme = useTheme();
  return (
    <div className="w-full max-w-2xl mx-auto flex items-center justify-between px-1">
      {ARCHITECTURE_FLOW.map((s, i) => {
        const color = s.key === "textMuted" ? theme.textMuted : theme[s.key];
        return (
          <React.Fragment key={s.label}>
            <FlowNode icon={s.icon} label={s.label} color={color} />
            {i < ARCHITECTURE_FLOW.length - 1 && <FlowConnector color={color} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}
function DataFlowField({ isDark }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let W = window.innerWidth, H = window.innerHeight;
    canvas.width = W; canvas.height = H;
    const COLORS = isDark ? ["#3ddc84", "#5eb1ef", "#f5b942", "#ef6f9e"] : ["#0f9a54", "#1c7ab0", "#b3790f", "#b23a6d"];
    const clearColor = isDark ? "7,11,10" : "243,247,243";
    const LANES = 14;
    const laneY = Array.from({ length: LANES }, () => Math.random() * H);
    const particles = Array.from({ length: 46 }, () => ({
      x: Math.random() * W, y: laneY[Math.floor(Math.random() * LANES)],
      vx: 0.3 + Math.random() * 0.9, r: Math.random() * 1.6 + 0.8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)], alpha: Math.random() * 0.35 + 0.2,
    }));

    const draw = () => {
      ctx.fillStyle = `rgba(${clearColor},0.16)`;
      ctx.fillRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.vx;
        if (p.x > W + 20) p.x = -20;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, "0");
        ctx.fill();
        ctx.beginPath(); ctx.moveTo(p.x - 14, p.y); ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = p.color + "22"; ctx.lineWidth = 1; ctx.stroke();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => { W = window.innerWidth; H = window.innerHeight; canvas.width = W; canvas.height = H; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", onResize); };
  }, [isDark]);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-70" data-print-hide="true" />;
}

/* ============================
   Typing Animator
   ============================ */
function TypingText({ texts }) {
  const theme = useTheme();
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const target = texts[index];
    let timeout;
    if (!deleting && displayed.length < target.length) timeout = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 55);
    else if (!deleting && displayed.length === target.length) timeout = setTimeout(() => setDeleting(true), 1700);
    else if (deleting && displayed.length > 0) timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 30);
    else if (deleting && displayed.length === 0) { setDeleting(false); setIndex(i => (i + 1) % texts.length); }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, index, texts]);

  return <span className="font-mono" style={{ color: theme.green }}>{displayed}<span className="animate-pulse">▌</span></span>;
}

/* ============================
   Stat tile
   ============================ */
function StatTile({ value, label, colorKey }) {
  const theme = useTheme();
  const color = theme[colorKey];
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const spotlight = useSpotlight();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const num = parseInt(value);
    let start = 0;
    const step = Math.ceil(num / 36);
    const timer = setInterval(() => { start += step; if (start >= num) { setCount(num); clearInterval(timer); } else setCount(start); }, 28);
    return () => clearInterval(timer);
  }, [visible, value]);

  return (
    <div ref={ref} onMouseMove={spotlight.onMouseMove} className="rounded-lg border px-4 py-3 text-left spotlight-card relative overflow-hidden" style={{ background: theme.cardBg, borderColor: theme.cardBorder }}>
      <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest relative z-10" style={{ color: theme.textMuted }}>
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />{label}
      </div>
      <div className="text-2xl sm:text-3xl font-bold font-mono mt-1 relative z-10" style={{ color }}>{count}{value.includes("+") ? "+" : ""}</div>
    </div>
  );
}

/* ============================
   Skill card
   ============================ */
function SkillCard({ skill, index }) {
  const theme = useTheme();
  const color = theme[skill.key];
  const [hovered, setHovered] = useState(false);
  const spotlight = useSpotlight();
  const level = PROFICIENCY_TIERS[skill.proficiency] || 1;

  return (
    <motion.div
      variants={cardFade("up", index * 0.03)}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onMouseMove={spotlight.onMouseMove}
      className="relative rounded-xl p-4 overflow-hidden border spotlight-card"
      style={{ background: theme.cardBg, borderColor: hovered ? color + "70" : theme.cardBorder, boxShadow: hovered ? `0 0 24px ${color}20` : "none", transition: "box-shadow 0.25s, border-color 0.25s" }}
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-2.5 gap-2">
          <div>
            <h3 className="font-bold text-base font-mono flex items-center gap-1.5" style={{ color: theme.text }}>
              {skill.name}
              {skill.current && <span className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0" style={{ background: theme.green }} title="Currently in active use" />}
            </h3>
            <GlowText as="p" text={skill.description} className="text-sm mt-0.5" style={{ color: theme.textSecondary }} radius={70} glowColor={color} />
          </div>
          <span className="flex-shrink-0 text-[11px] font-mono font-bold px-2 py-0.5 rounded border uppercase" style={{ color, borderColor: color + "60", background: color + "12" }}>{skill.proficiency}</span>
        </div>

        <div className="flex items-end gap-[3px] h-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="rounded-sm" style={{
              width: 5, height: 5 + i * 3.5,
              background: i < level ? color : "rgba(120,120,120,0.2)",
              transition: "background 0.2s",
            }} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ============================
   Section shell — stage framing
   ============================ */
function StageShell({ id, children, noPad }) {
  const theme = useTheme();
  const stage = STAGES.find(s => s.id === id);
  return (
    <section id={id} className={`relative ${noPad ? "" : "py-16 sm:py-24"}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {stage && (
          <motion.div className="mb-10 sm:mb-14" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-sm font-bold px-2.5 py-1 rounded border" style={{ color: theme.green, borderColor: theme.cardBorder, background: theme.cardBg }}>STAGE {stage.code}</span>
              <span className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${theme.green}55, transparent)` }} />
              <span className="font-mono text-xs uppercase tracking-widest" style={{ color: theme.textMuted }}>{stage.desc}</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-black tracking-tight font-mono" style={{ color: theme.text }}>
              <ZoomText text={stage.label} radius={140} maxScale={1.35} />
              <span style={{ color: theme.green }}>_</span>
            </h2>
          </motion.div>
        )}
        {children}
      </div>
    </section>
  );
}

/* ============================
   Architecture flow (horizontal pipeline chips)
   ============================ */
function FlowBlock({ steps }) {
  const theme = useTheme();
  return (
    <div className="rounded-xl p-4 border" style={{ background: theme.inputBg, borderColor: theme.cardBorder }}>
      <div className="text-xs font-mono font-bold mb-3 flex items-center gap-2 uppercase tracking-widest" style={{ color: theme.textMuted }}>
        <Workflow size={13} style={{ color: theme.blue }} /> data flow
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {steps.map((step, i) => (
          <React.Fragment key={i}>
            <div className="rounded-lg px-3 py-1.5 text-sm font-mono border" style={{ background: theme.cardBg, borderColor: theme.cardBorder, color: theme.text }}>{step}</div>
            {i < steps.length - 1 && <ArrowRight size={14} style={{ color: theme.green }} className="flex-shrink-0" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/* ============================
   Glow cursor
   ============================ */
function GlowCursor({ isDark }) {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [isHover, setIsHover] = useState(false);
  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    const enter = (e) => { if (e.target.closest("button,a")) setIsHover(true); };
    const leave = () => setIsHover(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", enter);
    window.addEventListener("mouseout", leave);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseover", enter); window.removeEventListener("mouseout", leave); };
  }, []);
  return (
    <motion.div
      className="fixed z-[9999] pointer-events-none rounded-full hidden sm:block" data-print-hide="true"
      animate={{ x: pos.x - (isHover ? 20 : 10), y: pos.y - (isHover ? 20 : 10), scale: isHover ? 1.6 : 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 20, mass: 0.5 }}
      style={{
        width: isHover ? 40 : 20, height: isHover ? 40 : 20,
        mixBlendMode: isDark ? "screen" : "multiply",
        background: isDark
          ? "radial-gradient(circle, rgba(61,220,132,0.75) 0%, rgba(94,177,239,0.35) 60%, transparent 100%)"
          : "radial-gradient(circle, rgba(15,154,84,0.55) 0%, rgba(28,122,176,0.3) 60%, transparent 100%)",
      }}
    />
  );
}

/* ============================
   Live uptime ticker
   ============================ */
function UptimeTicker() {
  const theme = useTheme();
  const [secs, setSecs] = useState(0);
  useEffect(() => { const t = setInterval(() => setSecs(s => s + 1), 1000); return () => clearInterval(t); }, []);
  const fmt = (n) => String(n).padStart(2, "0");
  const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60), s = secs % 60;
  return (
    <span className="hidden lg:flex items-center gap-1.5 text-xs font-mono" style={{ color: theme.textMuted }}>
      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: theme.green }} />
      uptime {fmt(h)}:{fmt(m)}:{fmt(s)}
    </span>
  );
}

/* ============================
   MAIN APP
   ============================ */
export default function App() {
  useGlobalWordZoom();
  const [isDark, setIsDark] = useState(true);
  const theme = isDark ? THEMES.night : THEMES.day;

  const [booted, setBooted] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [skillFilter, setSkillFilter] = useState("all");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

  const sectionRefs = useRef({});
  const sectionIds = useMemo(() => SECTION_IDS, []);

  useEffect(() => {
    const stage = STAGES.find(s => s.id === activeSection);
    document.title = stage ? `Parth · ${stage.code} ${stage.label}` : "Parth — AI Data Engineer";
  }, [activeSection]);

  const scrollTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(id);
    setMobileOpen(false);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 50);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll);
    const observer = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); }), { threshold: 0.3 });
    sectionIds.forEach((id) => { const el = document.getElementById(id); if (el) { observer.observe(el); sectionRefs.current[id] = el; } });
    return () => { window.removeEventListener("scroll", onScroll); observer.disconnect(); };
  }, [sectionIds]);

  useEffect(() => {
    const onKey = (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPaletteOpen(o => !o); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const copyEmail = () => { navigator.clipboard?.writeText("parthsingh1253@gmail.com"); setEmailCopied(true); setTimeout(() => setEmailCopied(false), 1800); };

  const filteredSkills = skillFilter === "all" ? SKILLS : SKILLS.filter(s => s.category === skillFilter);
  const cardStyle = { background: theme.cardBg, borderColor: theme.cardBorder };
  const spotlight = useSpotlight();
  const { scrollY } = useScroll();
  const blobY1 = useTransform(scrollY, [0, 2400], [0, -180]);
  const blobY2 = useTransform(scrollY, [0, 2400], [0, 140]);

  return (
    <ThemeContext.Provider value={theme}>
      <div className="min-h-screen overflow-x-hidden transition-colors duration-500" style={{ background: theme.bg, color: theme.text, fontFamily: "'Inter', sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap');
          * { box-sizing: border-box; }
          .font-mono { font-family: 'JetBrains Mono', monospace; }
          ::-webkit-scrollbar { width: 4px; }
          ::-webkit-scrollbar-track { background: ${theme.bg}; }
          ::-webkit-scrollbar-thumb { background: linear-gradient(180deg, ${theme.green}, ${theme.blue}); border-radius: 4px; }
          .glow-text { animation: glowPulse 3.6s ease-in-out infinite; }
          @keyframes glowPulse {
            0%, 100% { text-shadow: 0 0 40px ${theme.green}55, 0 0 80px ${theme.blue}33; }
            50% { text-shadow: 0 0 58px ${theme.green}85, 0 0 105px ${theme.blue}55; }
          }
          .card-hover { transition: transform 0.25s ease, box-shadow 0.25s ease; }
          .card-hover:hover { transform: translateY(-5px); box-shadow: 0 16px 44px rgba(0,0,0,0.28); }
          .link-sweep { position: relative; }
          .link-sweep::after {
            content: ''; position: absolute; left: 0; bottom: -2px; width: 0; height: 1px;
            background: currentColor; transition: width 0.25s ease;
          }
          .link-sweep:hover::after { width: 100%; }
          @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          .marquee-track { animation: marquee 32s linear infinite; }
          .spotlight-card::before {
            content: ''; position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
            background: radial-gradient(360px circle at var(--mx,50%) var(--my,50%), ${theme.spotlight}, transparent 45%);
            opacity: 0; transition: opacity 0.3s;
          }
          .spotlight-card:hover::before { opacity: 1; }
          .text-glow-overlay {
            position: absolute; inset: 0; pointer-events: none;
            -webkit-mask-image: radial-gradient(var(--glow-radius, 90px) circle at var(--tx, -999px) var(--ty, -999px), black 0%, black 25%, transparent 70%);
            mask-image: radial-gradient(var(--glow-radius, 90px) circle at var(--tx, -999px) var(--ty, -999px), black 0%, black 25%, transparent 70%);
          }
          ::selection { background: ${theme.green}; color: ${theme.onAccent}; }
          :focus-visible { outline: 2px solid ${theme.green}; outline-offset: 2px; }
          .noise-overlay {
            position: fixed; inset: 0; z-index: 1; pointer-events: none; opacity: 0.035; mix-blend-mode: overlay;
            background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          }
          .spotlight-card { box-shadow: inset 0 1px 0 rgba(255,255,255,0.05); }
          .shine-btn { position: relative; overflow: hidden; }
          .shine-btn::after {
            content: ''; position: absolute; top: 0; left: -60%; width: 40%; height: 100%;
            background: linear-gradient(120deg, transparent, rgba(255,255,255,0.35), transparent);
            transform: skewX(-20deg);
          }
          .shine-btn:hover::after { animation: shineSweep 0.9s ease forwards; }
          @keyframes shineSweep { from { left: -60%; } to { left: 130%; } }
          @media print {
            body { background: #fff !important; }
            nav, footer, .marquee-parent, [data-print-hide="true"] { display: none !important; }
            .zword { transform: none !important; }
            .text-glow-overlay { display: none !important; }
            .noise-overlay { display: none !important; }
            section { break-inside: avoid; page-break-inside: avoid; }
            * { box-shadow: none !important; text-shadow: none !important; animation: none !important; }
          }
        `}</style>

        <AnimatePresence>{!booted && <BootSequence onDone={() => setBooted(true)} />}</AnimatePresence>

        <ScrollProgressBar progress={scrollPct} />
        <div className="noise-overlay" data-print-hide="true" />
        <DataFlowField isDark={isDark} />
        <GlowCursor isDark={isDark} />
        <PipelineRail active={activeSection} onJump={scrollTo} />
        <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onNavigate={scrollTo} onToggleTheme={() => setIsDark(d => !d)} isDark={isDark} />

        <div className="fixed inset-0 z-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(${theme.gridColor} 1px, transparent 1px), linear-gradient(90deg, ${theme.gridColor} 1px, transparent 1px)`, backgroundSize: "56px 56px" }} />
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <motion.div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[130px]" style={{ background: `radial-gradient(circle, ${theme.green}14, transparent)`, y: blobY1 }} />
          <motion.div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] rounded-full blur-[110px]" style={{ background: `radial-gradient(circle, ${theme.blue}14, transparent)`, y: blobY2 }} />
        </div>

        {/* ===== NAV ===== */}
        <motion.nav variants={navFade} initial="hidden" animate="show"
          className="fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300"
          style={{ background: isScrolled ? theme.navBg : "transparent", backdropFilter: isScrolled ? "blur(20px)" : "none", borderColor: isScrolled ? theme.cardBorder : "transparent" }}>
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <motion.div className="flex items-center gap-2 cursor-pointer font-mono" onClick={() => scrollTo("home")} whileHover={{ scale: 1.03 }}>
                <Terminal size={16} style={{ color: theme.green }} />
                <ZoomText text="parth@pipeline" radius={90} maxScale={1.3} as="span" className="font-bold text-base sm:text-lg" style={{ color: theme.text }} />
                <span className="font-bold text-base sm:text-lg" style={{ color: theme.textMuted }}>:~$</span>
              </motion.div>

              <div className="hidden md:flex items-center gap-1 font-mono">
                {STAGES.map((s) => (
                  <motion.button key={s.id} onClick={() => scrollTo(s.id)}
                    className="relative px-2.5 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-colors"
                    style={{ color: activeSection === s.id ? theme.green : theme.textSecondary }}
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                    {activeSection === s.id && (
                      <motion.span
                        layoutId="navPill"
                        className="absolute inset-0 rounded-md"
                        style={{ background: theme.green + "1a", border: `1px solid ${theme.green}55` }}
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10">{s.code}·{s.label}</span>
                  </motion.button>
                ))}
              </div>

              <div className="flex items-center gap-2.5">
                <UptimeTicker />
                <motion.button onClick={() => setPaletteOpen(true)}
                  className="hidden sm:flex items-center gap-1.5 text-xs font-mono px-2.5 py-1.5 rounded-lg border" style={{ borderColor: theme.cardBorder, color: theme.textMuted }}
                  whileHover={{ scale: 1.05, borderColor: theme.green + "55", color: theme.green }}>
                  <Command size={12} /> K
                </motion.button>
                <ThemeToggle isDark={isDark} onToggle={() => setIsDark(d => !d)} />
                <MagneticButton as="a" href="/Data_and_AI_Resume.pdf" target="_blank" rel="noopener noreferrer"
                  className="hidden md:inline-flex items-center gap-2 text-sm font-bold font-mono px-4 py-2 rounded-lg border"
                  style={{ borderColor: theme.green + "55", color: theme.green }}>
                  resume.pdf <ArrowUpRight size={13} />
                </MagneticButton>
                <button className="md:hidden p-2 rounded-lg" style={{ background: theme.cardBg, color: theme.text }} onClick={() => setMobileOpen(true)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </motion.nav>

        {/* ===== MOBILE MENU ===== */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[998]" style={{ background: theme.mode === "night" ? "rgba(5,9,8,0.95)" : "rgba(243,247,243,0.96)", backdropFilter: "blur(16px)" }} onClick={() => setMobileOpen(false)} />
              <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 120, damping: 20 }}
                className="fixed right-0 top-0 bottom-0 w-72 z-[999] p-6 flex flex-col border-l font-mono" style={{ background: theme.bg, borderColor: theme.cardBorder }}>
                <div className="flex justify-between items-center mb-8">
                  <span className="font-bold text-lg" style={{ color: theme.text }}>parth<span style={{ color: theme.green }}>.</span></span>
                  <div className="flex items-center gap-2">
                    <ThemeToggle isDark={isDark} onToggle={() => setIsDark(d => !d)} />
                    <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg" style={{ background: theme.cardBg, color: theme.text }}><X size={18} /></button>
                  </div>
                </div>
                <nav className="flex flex-col gap-2">
                  {STAGES.map((s) => (
                    <button key={s.id} onClick={() => scrollTo(s.id)} className="text-left px-4 py-3 rounded-xl font-semibold text-sm transition-all"
                      style={{ background: activeSection === s.id ? theme.green + "20" : theme.cardBg, color: activeSection === s.id ? theme.green : theme.textSecondary, border: `1px solid ${activeSection === s.id ? theme.green + "55" : theme.cardBorder}` }}>
                      {s.code} · {s.label}
                    </button>
                  ))}
                </nav>
                <div className="mt-auto">
                  <a href="/Data_and_AI_Resume.pdf" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 border py-3 rounded-xl font-bold text-sm" style={{ borderColor: theme.green + "55", color: theme.green }}>
                    resume.pdf <ArrowUpRight size={14} />
                  </a>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ===== HERO ===== */}
        <section id="home" className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-4">
          <div className="relative z-10 max-w-4xl w-full text-center">
            <motion.div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border mb-6 font-mono text-xs" style={{ background: theme.cardBg, borderColor: theme.cardBorder, color: theme.textSecondary }} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: theme.green }} /> STATUS: OPEN_TO_OPPORTUNITIES
            </motion.div>
            <motion.p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: theme.textMuted }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.08 }}>
              currently shipping // Data Engineer @ Nagarro
            </motion.p>

            <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} className="mb-5">
              <motion.div className="relative inline-block" animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                <motion.div className="absolute inset-0 rounded-full blur-2xl opacity-50" style={{ background: `radial-gradient(circle, ${theme.green}, ${theme.blue})` }} animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity }} />
                <img src="/img.jpeg" alt="Parth" className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 shadow-2xl" style={{ borderColor: theme.green + "80" }} />
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-2 flex items-center justify-center" style={{ background: theme.green, borderColor: theme.bg }}>
                  <Radio size={12} className="text-black" />
                </div>
              </motion.div>
              <div className="mt-2.5 text-[11px] font-mono uppercase tracking-widest" style={{ color: theme.textMuted }}>
                FIG. 01 — DATA ENGINEER
              </div>
            </motion.div>

            <motion.h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-none font-mono glow-text" style={{ color: theme.text }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <ZoomText text="PARTH." radius={170} maxScale={1.45} />
            </motion.h1>

            <motion.div className="mt-3 text-lg sm:text-2xl md:text-3xl font-bold h-9 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <TypingText texts={["AI Data Engineer", "DataOps Engineer", "Pipeline Architect"]} />
            </motion.div>

            <motion.p className="mt-4 max-w-2xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <GlowText
                text="I build scalable data pipelines, ML-integrated workflows, and GenAI-powered solutions using cloud-native tools — from raw ingestion to model deployment, end to end."
                as="span" className="text-base sm:text-lg leading-relaxed" style={{ color: theme.textSecondary }} radius={100}
              />
            </motion.p>

            <motion.div className="mt-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <PipelineConsole />
            </motion.div>

            <motion.div className="mt-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
              <ArchitectureDiagram />
            </motion.div>

            <motion.div className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-2xl mx-auto" initial="hidden" animate="show" variants={containerStagger}>
              <StatTile value="1" label="rows_processed_m" colorKey="blue" />
              <StatTile value="3" label="certifications" colorKey="amber" />
              <StatTile value="5" label="pipelines_shipped" colorKey="green" />
              <StatTile value="12" label="stack_size" colorKey="pink" />
            </motion.div>

            <motion.div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center items-center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <MagneticButton onClick={() => scrollTo("projects")} className="shine-btn w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-base font-mono" style={{ background: theme.green, color: theme.onAccent }}>
                <span className="relative z-10 flex items-center justify-center gap-2"><Rocket size={16} /> view_pipeline_runs()</span>
              </MagneticButton>
              <MagneticButton as="a" href="/Data_and_AI_Resume.pdf" target="_blank" rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-base border font-mono inline-flex items-center justify-center gap-2"
                style={{ borderColor: theme.cardBorder, color: theme.textSecondary }}>
                resume.pdf <ArrowUpRight size={15} />
              </MagneticButton>
            </motion.div>
          </div>

          <motion.div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <span className="text-xs tracking-widest uppercase font-mono" style={{ color: theme.textMuted }}>scroll</span>
            <ChevronDown size={16} style={{ color: theme.textMuted }} />
          </motion.div>
        </section>

        {/* ===== MARQUEE TICKER ===== */}
        <div className="relative z-10 py-3 border-y overflow-hidden" style={{ borderColor: theme.cardBorder, background: theme.mode === "night" ? "rgba(15,23,20,0.4)" : "rgba(255,255,255,0.4)" }}>
          <div className="flex whitespace-nowrap marquee-track font-mono text-xs sm:text-sm tracking-widest" style={{ color: theme.textMuted }}>
            {[...Array(2)].map((_, rep) => (
              <React.Fragment key={rep}>
                {["AZURE", "DATABRICKS", "SNOWFLAKE", "DBT", "PYSPARK", "MLFLOW", "PYTHON", "SQL", "DELTA LAKE", "GENAI", "1M+ ROWS", "AIRFLOW"].map((t, i) => (
                  <span key={t + rep + i} className="mx-4 flex items-center gap-4">{t} <span style={{ color: theme.green }}>{"//"}</span></span>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ===== 01 · ABOUT (INGEST) ===== */}
        <StageShell id="about">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            <motion.div className="space-y-4" initial="hidden" whileInView="show" variants={containerStagger} viewport={{ once: true }}>
              <motion.div variants={cardFade("up")} onMouseMove={spotlight.onMouseMove} className="rounded-2xl p-6 border card-hover spotlight-card relative overflow-hidden" style={cardStyle}>
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2 font-mono relative z-10" style={{ color: theme.blue }}><Target size={16} /> profile.summary</h3>
                <GlowText
                  as="p" className="text-base leading-relaxed relative z-10" style={{ color: theme.textSecondary }} glowColor={theme.blue}
                  text="Data and AI Engineer with hands-on experience building scalable data pipelines and integrating machine learning and MLOps practices into data workflows. Currently a Data Engineer at Nagarro, working with Azure Synapse, Snowflake, dbt, and Apache Airflow. Skilled in the modern data stack and cloud platforms, with growing expertise in Generative AI and Agentic AI — RAG, Vector Databases, and AI Agents. I care about clean data layers, schema enforcement, and analytics-ready outputs."
                />
              </motion.div>
              <motion.div variants={cardFade("up", 0.07)} onMouseMove={spotlight.onMouseMove} className="rounded-2xl p-6 border card-hover spotlight-card relative overflow-hidden" style={cardStyle}>
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2 font-mono relative z-10" style={{ color: theme.green }}><BookOpen size={16} /> education.log</h3>
                <p className="font-bold text-base relative z-10" style={{ color: theme.text }}>B.Tech in Computer Science Engineering</p>
                <p className="text-base relative z-10" style={{ color: theme.textSecondary }}>University of Petroleum and Energy Studies, Dehradun</p>
                <p className="text-base mt-1 font-semibold relative z-10" style={{ color: theme.pink }}>Specialization: Cloud Computing and DevOps</p>
                <p className="text-xs mt-2 font-mono relative z-10" style={{ color: theme.textMuted }}>Aug 2021 – Jun 2025 · Grade: A</p>
              </motion.div>
              <motion.div variants={cardFade("up", 0.1)} className="rounded-2xl p-4 border flex flex-wrap gap-2.5" style={cardStyle}>
                {QUICK_PROOF.map(p => (
                  <div key={p.value} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm" style={{ borderColor: theme.cardBorder, color: theme.textSecondary }}>
                    <span style={{ color: theme[p.key] }}>{p.icon}</span> {p.value}
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div className="rounded-2xl p-6 border" style={cardStyle} initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <h3 className="font-bold text-lg mb-5 flex items-center gap-2 font-mono" style={{ color: theme.pink }}><TrendingUp size={16} /> run_history.log</h3>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px" style={{ background: `linear-gradient(180deg, ${theme.green}, ${theme.blue}, ${theme.pink})`, opacity: 0.4 }} />
                <div className="space-y-5">
                  {TIMELINE.map((item, i) => (
                    <motion.div key={i} className="relative flex gap-4 pl-10" initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                      <div className="absolute left-2 w-5 h-5 rounded-full flex items-center justify-center border-2 z-10" style={{ background: theme[item.key], borderColor: theme.bg, top: "2px" }}>
                        <CheckCircle2 size={11} className="text-black" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="text-sm font-black" style={{ color: theme[item.key] }}>{item.year}</span>
                          <span className="text-sm font-bold" style={{ color: theme.text }}>{item.title}</span>
                        </div>
                        <p className="text-sm mt-0.5" style={{ color: theme.textSecondary }}>{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </StageShell>

        {/* ===== 02 · EXPERIENCE (DEPLOY) ===== */}
        <StageShell id="experience">
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-4 top-2 bottom-2 w-px" style={{ background: `linear-gradient(180deg, ${theme.green}, ${theme.blue})`, opacity: 0.35 }} />
            <div className="space-y-6">
              {EXPERIENCE.map((job, i) => (
                <motion.div
                  key={job.company} className="relative pl-12"
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                >
                  <div className="absolute left-1.5 top-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center z-10"
                    style={{ background: job.status === "ACTIVE" ? theme.green : theme.cardBg, borderColor: theme[job.key] }}>
                    {job.status === "ACTIVE" && <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: theme.onAccent }} />}
                  </div>

                  <div onMouseMove={spotlight.onMouseMove} className="rounded-2xl border p-5 sm:p-6 spotlight-card relative overflow-hidden" style={cardStyle}>
                    <div className="relative z-10">
                      <div className="flex flex-wrap items-center gap-2 mb-2 font-mono text-xs">
                        <span className="font-black px-2.5 py-1 rounded-full flex items-center gap-1.5" style={{ background: theme[job.key] + "20", color: theme[job.key] }}>
                          {job.status === "ACTIVE" && <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: theme[job.key] }} />}
                          {job.status}
                        </span>
                        <span className="flex items-center gap-1" style={{ color: theme.textMuted }}><Calendar size={11} /> {job.period}</span>
                        <span className="flex items-center gap-1" style={{ color: theme.textMuted }}><MapPin size={11} /> {job.location}</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-black" style={{ color: theme.text }}>{job.role}</h3>
                      <p className="text-base font-mono mb-3" style={{ color: theme[job.key] }}>@ {job.company}</p>
                      <div className="space-y-2 mb-3">
                        {job.bullets.map((b, idx) => (
                          <div key={idx} className="flex gap-2.5 text-sm" style={{ color: theme.textSecondary }}>
                            <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full" style={{ background: theme[job.key] }} />
                            <GlowText as="span" text={b} radius={85} glowColor={theme[job.key]} />
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1.5 font-mono">
                        {job.tech.map(t => (
                          <span key={t} className="text-xs border rounded-lg font-medium px-2.5 py-1" style={{ background: theme.inputBg, borderColor: theme.cardBorder, color: theme.textSecondary }}>{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </StageShell>

        {/* ===== 03 · SKILLS (SCHEMA) ===== */}
        <StageShell id="skills">
          <div className="mb-10">
            <div className="text-xs font-mono uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: theme.textMuted }}>
              <span style={{ color: theme.green }}>{"//"}</span> primary instruments
            </div>
            <motion.div className="flex flex-wrap gap-3 sm:gap-4" initial="hidden" whileInView="show" variants={containerStagger} viewport={{ once: true }}>
              {PRIMARY_INSTRUMENTS.map((t, i) => (
                <motion.div key={t.name} variants={cardFade("up", i * 0.03)}
                  className="flex flex-col items-center gap-2 rounded-xl border px-4 py-3 w-24" style={cardStyle}
                  whileHover={{ y: -3 }}>
                  {t.logo ? (
                    <img src={t.logo} alt={t.name} className="w-7 h-7" style={{ filter: theme.mode === "night" ? "none" : "none" }} />
                  ) : (
                    <span style={{ color: theme[t.key] }}>{t.icon}</span>
                  )}
                  <span className="text-[10px] font-mono text-center leading-tight" style={{ color: theme.textSecondary }}>{t.name}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="flex flex-wrap gap-2 justify-center mb-8 font-mono">
            {SKILL_CATEGORIES.map(cat => (
              <motion.button key={cat.id} onClick={() => setSkillFilter(cat.id)}
                className="relative px-3.5 py-1.5 rounded-full text-xs font-bold border uppercase tracking-wide overflow-hidden"
                style={{ color: skillFilter === cat.id ? theme.green : theme.textSecondary, borderColor: skillFilter === cat.id ? theme.green + "70" : theme.cardBorder }}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                {skillFilter === cat.id && (
                  <motion.span
                    layoutId="categoryPill"
                    className="absolute inset-0 rounded-full"
                    style={{ background: theme.green + "22" }}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{cat.label}</span>
              </motion.button>
            ))}
          </div>

          <motion.div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12" initial="hidden" whileInView="show" variants={containerStagger} viewport={{ once: true }} key={skillFilter}>
            <AnimatePresence mode="popLayout">
              {filteredSkills.map((skill, idx) => (
                <motion.div key={skill.name} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }} transition={{ delay: idx * 0.025 }}>
                  <SkillCard skill={skill} index={idx} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          <motion.div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4" initial="hidden" whileInView="show" variants={containerStagger} viewport={{ once: true }}>
            {[
              { icon: <Cloud size={22} />, title: "Cloud", items: ["Azure Synapse", "ADF", "ADLS Gen2", "AWS EC2/S3"], key: "blue" },
              { icon: <Database size={22} />, title: "Data Engineering", items: ["PySpark", "Databricks", "Airflow", "Snowflake", "dbt"], key: "green" },
              { icon: <ShieldCheck size={22} />, title: "DevOps", items: ["Docker", "Jenkins", "Git/GitLab"], key: "amber" },
              { icon: <Sparkles size={22} />, title: "GenAI", items: ["RAG", "Vector DBs", "AI Agents"], key: "pink" },
            ].map((block, i) => (
              <motion.div key={block.title} variants={cardFade("up", i * 0.07)} onMouseMove={spotlight.onMouseMove} className="relative rounded-2xl p-5 text-center border card-hover spotlight-card overflow-hidden" style={cardStyle}>
                <div className="relative z-10">
                  <div className="w-11 h-11 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: theme[block.key] + "18", color: theme[block.key] }}>{block.icon}</div>
                  <h3 className="text-base font-black mb-3 font-mono" style={{ color: theme[block.key] }}>{block.title}</h3>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {block.items.map(item => (<span key={item} className="border rounded-full text-xs font-medium px-2 py-0.5 font-mono" style={{ background: theme.inputBg, borderColor: theme.cardBorder, color: theme.textSecondary }}>{item}</span>))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </StageShell>

        {/* ===== 04 · STRENGTHS (OFFER) ===== */}
        <StageShell id="strengths">
          <motion.div className="grid sm:grid-cols-3 gap-4 mb-10" initial="hidden" whileInView="show" variants={containerStagger} viewport={{ once: true }}>
            {CAPABILITIES.map((c, i) => (
              <motion.div key={c.code} variants={cardFade("up", i * 0.08)} onMouseMove={spotlight.onMouseMove}
                className="relative rounded-2xl p-5 border spotlight-card overflow-hidden" style={cardStyle}>
                <div className="relative z-10">
                  <div className="text-[11px] font-mono font-bold mb-2 tracking-widest" style={{ color: theme[c.key] }}>{c.code}</div>
                  <h3 className="text-base font-black mb-2" style={{ color: theme.text }}>{c.title}</h3>
                  <GlowText as="p" text={c.desc} className="text-sm leading-relaxed" style={{ color: theme.textSecondary }} radius={85} glowColor={theme[c.key]} />
                </div>
                <div className="absolute inset-x-0 bottom-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${theme[c.key]}, transparent)` }} />
              </motion.div>
            ))}
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div onMouseMove={spotlight.onMouseMove} className="rounded-2xl p-6 border card-hover spotlight-card relative overflow-hidden" style={cardStyle} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 font-mono" style={{ color: theme.green }}><CheckCircle2 size={16} /> transform.rules</h3>
                <div className="space-y-3">
                  {WHAT_I_BRING.map((x, i) => (
                    <motion.div key={i} className="flex gap-3 text-base" style={{ color: theme.textSecondary }} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: theme.green }} />
                      <GlowText as="span" text={x} radius={85} glowColor={theme.green} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div className="space-y-4" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <div onMouseMove={spotlight.onMouseMove} className="rounded-2xl p-6 border card-hover spotlight-card relative overflow-hidden" style={cardStyle}>
                <div className="relative z-10">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2 font-mono" style={{ color: theme.blue }}><Briefcase size={16} /> target.roles</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Data and AI Engineer", "DataOps Engineer", "AI Platform Engineer", "AI Infrastructure Engineer"].map((r, i) => {
                      const keys = ["blue", "green", "amber", "pink"];
                      const c = theme[keys[i % 4]];
                      return (
                        <motion.span key={r} className="px-3 py-1.5 rounded-full text-sm font-bold border font-mono" style={{ borderColor: c + "40", color: c, background: c + "12" }} whileHover={{ scale: 1.06 }}>{r}</motion.span>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl p-6 border" style={{ background: theme.cardBg, borderColor: theme.pink + "50" }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: theme.pink + "20", color: theme.pink }}><Sparkles size={15} /></div>
                  <h3 className="text-base font-bold font-mono" style={{ color: theme.pink }}>currently.exploring</h3>
                </div>
                <GlowText
                  as="p" className="text-sm leading-relaxed" style={{ color: theme.textSecondary }} radius={85} glowColor={theme.pink}
                  text="RAG pipelines, LLM-powered data quality checks, and integrating GenAI into ELT/ETL workflows for smarter transformation."
                />
                <div className="mt-3 flex gap-2 flex-wrap font-mono">
                  {["RAG", "LangChain", "Vector DBs"].map(t => (<span key={t} className="text-xs border px-2 py-0.5 rounded-full font-medium" style={{ background: theme.pink + "10", borderColor: theme.pink + "40", color: theme.pink }}>{t}</span>))}
                </div>
              </div>
            </motion.div>
          </div>
        </StageShell>

        {/* ===== 05 · PROJECTS (LOAD) ===== */}
        <StageShell id="projects">
          <div className="space-y-8">
            {PROJECTS.map((p, i) => (
              <motion.div key={p.title} initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.45 }}>
                <TiltCard className="relative rounded-3xl p-6 sm:p-8 border spotlight-card overflow-hidden" style={cardStyle}>
                  <div onMouseMove={spotlight.onMouseMove} className="absolute inset-0" style={{ pointerEvents: "none" }} />
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4 mb-6 relative z-10">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2 font-mono text-xs">
                        <span className="font-black px-3 py-1 rounded-full" style={{ background: theme.green + "20", color: theme.green }}>{p.tag}</span>
                        <span className="flex items-center gap-1" style={{ color: theme.textMuted }}><Calendar size={11} /> {p.duration}</span>
                        <span className="flex items-center gap-1" style={{ color: theme.textMuted }}><Users size={11} /> {p.client}</span>
                      </div>
                      <h3 className="text-xl sm:text-3xl font-black leading-tight" style={{ color: theme.text }}>{p.title}</h3>
                      <p className="text-base mt-1 font-mono" style={{ color: theme.textSecondary }}>{p.subtitle}</p>
                    </div>
                    <MagneticButton as="a" href={p.repo} target="_blank" rel="noopener noreferrer"
                      className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border font-mono"
                      style={{ background: theme.inputBg, borderColor: theme.cardBorder, color: theme.textSecondary }}>
                      <Github size={14} /> github <ArrowUpRight size={12} />
                    </MagneticButton>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-5 relative z-10">
                    <div className="space-y-4">
                      <div className="rounded-xl p-4 border" style={{ background: theme.inputBg, borderColor: theme.cardBorder }}>
                        <div className="text-xs font-bold mb-2 flex items-center gap-1.5 font-mono uppercase tracking-widest" style={{ color: theme.red }}><Target size={11} /> problem</div>
                        <GlowText as="p" text={p.problem} className="text-sm leading-relaxed" style={{ color: theme.textSecondary }} radius={85} glowColor={theme.red} />
                      </div>
                      <div className="rounded-xl p-4 border" style={{ background: theme.inputBg, borderColor: theme.cardBorder }}>
                        <div className="text-xs font-bold mb-2 flex items-center gap-1.5 font-mono uppercase tracking-widest" style={{ color: theme.blue }}><Zap size={11} /> objective</div>
                        <GlowText as="p" text={p.objective} className="text-sm leading-relaxed" style={{ color: theme.textSecondary }} radius={85} glowColor={theme.blue} />
                      </div>
                      <FlowBlock steps={p.architecture} />
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-xl p-4 border" style={{ background: theme.inputBg, borderColor: theme.cardBorder }}>
                        <div className="text-xs font-bold mb-3 flex items-center gap-1.5 font-mono uppercase tracking-widest" style={{ color: theme.pink }}><Code2 size={11} /> what i built</div>
                        <div className="space-y-2">
                          {p.approach.map((x, idx) => (<div key={idx} className="flex gap-2.5 text-sm" style={{ color: theme.textSecondary }}><span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full" style={{ background: theme.pink }} /> <GlowText as="span" text={x} radius={80} glowColor={theme.pink} /></div>))}
                        </div>
                      </div>
                      <div className="rounded-xl p-4 border" style={{ background: theme.inputBg, borderColor: theme.cardBorder }}>
                        <div className="text-xs font-bold mb-3 flex items-center gap-1.5 font-mono uppercase tracking-widest" style={{ color: theme.green }}><CheckCircle2 size={11} /> impact</div>
                        <div className="space-y-2">
                          {p.impact.map((x, idx) => (<div key={idx} className="flex gap-2.5 text-sm" style={{ color: theme.textSecondary }}><CheckCircle2 size={13} className="flex-shrink-0 mt-0.5" style={{ color: theme.green }} /> <GlowText as="span" text={x} radius={80} glowColor={theme.green} /></div>))}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-bold mb-2 font-mono uppercase tracking-widest" style={{ color: theme.textMuted }}>tech stack</div>
                        <div className="flex flex-wrap gap-1.5 font-mono">
                          {p.tech.map(t => (<span key={t} className="text-xs border rounded-lg font-medium px-2.5 py-1" style={{ background: theme.cardBg, borderColor: theme.cardBorder, color: theme.textSecondary }}>{t}</span>))}
                        </div>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </StageShell>

        {/* ===== 06 · CERTIFICATIONS (VALIDATE) ===== */}
        <StageShell id="certifications">
          <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {[
              { href: "https://credentials.databricks.com/80290364-9760-4912-80bb-628ecb05f2d6#acc.1QyUwPgn", icon: <Award size={22} />, title: "Databricks Certified", sub: "Data Engineer Associate", key: "red" },
              { href: "https://credentials.databricks.com/e77bcf6d-f559-47e7-beca-608373a5660b#acc.mVhSLHf9", icon: <Sparkles size={22} />, title: "Databricks Certified", sub: "Generative AI Engineer Associate", key: "pink" },
              { href: "https://www.hackerrank.com/certificates/731721820af3", icon: <ShieldCheck size={22} />, title: "HackerRank SQL", sub: "Advanced", key: "green" },
              { href: "https://www.hackerrank.com/certificates/6f58d3da3e47", icon: <ShieldCheck size={22} />, title: "HackerRank SQL", sub: "Intermediate", key: "blue" },
            ].map((cert, i) => (
              <motion.a key={i} href={cert.href} target="_blank" rel="noopener noreferrer" onMouseMove={spotlight.onMouseMove} className="relative overflow-hidden rounded-2xl p-5 flex items-center gap-4 group border spotlight-card" style={cardStyle}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} whileHover={{ scale: 1.02 }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 relative z-10" style={{ background: theme[cert.key] + "20", color: theme[cert.key] }}>{cert.icon}</div>
                <div className="relative z-10">
                  <div className="text-base font-black font-mono" style={{ color: theme.text }}>{cert.title}</div>
                  <div className="text-sm" style={{ color: theme.textSecondary }}>{cert.sub}</div>
                </div>
                <div className="ml-auto flex items-center gap-1.5 text-xs font-mono px-2 py-1 rounded-full border relative z-10" style={{ borderColor: theme[cert.key] + "40", color: theme[cert.key] }}><CheckCircle2 size={11} /> verified</div>
              </motion.a>
            ))}
          </div>
        </StageShell>

        {/* ===== 07 · CONTACT (SERVE) ===== */}
        <StageShell id="contact">
          <motion.div className="max-w-3xl mx-auto mb-10" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-xs font-mono uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: theme.textMuted }}>
              <span style={{ color: theme.green }}>{"//"}</span> ask my portfolio assistant
            </div>
            <ChatBot onToggleTheme={() => setIsDark(d => !d)} />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-4">
              <GlowText
                as="p" className="text-base leading-relaxed" style={{ color: theme.textSecondary }} radius={100}
                text="I'm currently building at Nagarro, and always open to interesting conversations around cloud-native data engineering, ML pipeline design, and GenAI. If you're building a modern data team — let's talk."
              />
              {[
                { icon: <Mail size={16} />, label: "parthsingh1253@gmail.com", href: "mailto:parthsingh1253@gmail.com", key: "blue", copyable: true },
                { icon: <Phone size={16} />, label: "+91 8527713603", href: "tel:+918527713603", key: "green" },
                { icon: <MapPin size={16} />, label: "Gurugram, Haryana, India", key: "amber" },
                { icon: <Github size={16} />, label: "GitHub Profile", href: "https://github.com/parthhhhh12", key: "pink" },
                { icon: <Linkedin size={16} />, label: "LinkedIn Profile", href: "https://www.linkedin.com/in/singh05e/", key: "blue" },
              ].map((item, i) => (
                <motion.div key={i} onMouseMove={spotlight.onMouseMove} className="flex items-center gap-4 rounded-xl p-4 border spotlight-card relative overflow-hidden" style={cardStyle}
                  initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} whileHover={{ x: 4 }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 relative z-10" style={{ background: theme[item.key] + "20", color: theme[item.key] }}>{item.icon}</div>
                  {item.href ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="link-sweep text-base font-mono relative z-10" style={{ color: theme.textSecondary }}>{item.label}</a>
                  ) : (
                    <span className="text-base font-mono relative z-10" style={{ color: theme.textSecondary }}>{item.label}</span>
                  )}
                  {item.copyable && (
                    <button onClick={copyEmail} className="ml-auto p-1.5 rounded-lg relative z-10" style={{ color: emailCopied ? theme.green : theme.textMuted }} aria-label="Copy email">
                      {emailCopied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  )}
                </motion.div>
              ))}
            </motion.div>

            <motion.form action="https://formspree.io/f/xgvnlvkd" method="POST" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative rounded-2xl p-6 space-y-4 border" style={cardStyle}>
              <div className="flex items-center gap-2 mb-1 font-mono text-xs uppercase tracking-widest" style={{ color: theme.textMuted }}><Cpu size={13} style={{ color: theme.green }} /> direct_line.connect()</div>
              {[{ id: "name", label: "name", type: "text", placeholder: "your_name" }, { id: "email", label: "email", type: "email", placeholder: "you@example.com" }].map(field => (
                <div key={field.id}>
                  <label htmlFor={field.id} className="text-xs font-bold mb-1.5 block uppercase tracking-wider font-mono" style={{ color: theme.textMuted }}>{field.label}</label>
                  <input type={field.type} name={field.id} id={field.id} required placeholder={field.placeholder} className="w-full px-4 py-2.5 rounded-xl text-base focus:outline-none focus:ring-1 transition-all border font-mono" style={{ background: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }} />
                </div>
              ))}
              <div>
                <label htmlFor="message" className="text-xs font-bold mb-1.5 block uppercase tracking-wider font-mono" style={{ color: theme.textMuted }}>message</label>
                <textarea name="message" id="message" rows={4} required placeholder="tell_me_about_the_role..." className="w-full px-4 py-2.5 rounded-xl text-base focus:outline-none focus:ring-1 transition-all resize-none border font-mono" style={{ background: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }} />
              </div>
              <MagneticButton className="w-full py-3 rounded-xl font-black text-base font-mono" style={{ background: theme.green, color: theme.onAccent }}>send_message()</MagneticButton>
              <p className="text-xs text-center font-mono" style={{ color: theme.textMuted }}>tip: mention the role — I'll respond faster. · press ⌘K anytime</p>
            </motion.form>
          </div>
        </StageShell>

        {/* ===== FOOTER ===== */}
        <footer className="py-10 border-t" style={{ borderColor: theme.cardBorder }}>
          <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
            <div className="flex items-center gap-2">
              <Terminal size={14} style={{ color: theme.green }} />
              <span className="text-sm font-bold" style={{ color: theme.text }}>parth<span style={{ color: theme.green }}>.</span></span>
            </div>
            <p className="text-xs flex items-center gap-2" style={{ color: theme.textMuted }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: theme.green }} /> SYSTEM STATUS: ALL PIPELINES OPERATIONAL · © 2026 Parth
            </p>
            <div className="flex items-center gap-3">
              <motion.a href="https://github.com/parthhhhh12" target="_blank" rel="noopener noreferrer" style={{ color: theme.textMuted }} whileHover={{ scale: 1.2, color: theme.green }}><Github size={16} /></motion.a>
              <motion.a href="https://www.linkedin.com/in/singh05e/" target="_blank" rel="noopener noreferrer" style={{ color: theme.textMuted }} whileHover={{ scale: 1.2, color: theme.blue }}><Linkedin size={16} /></motion.a>
              <motion.a href="mailto:parthsingh1253@gmail.com" style={{ color: theme.textMuted }} whileHover={{ scale: 1.2, color: theme.pink }}><Mail size={16} /></motion.a>
            </div>
          </div>
        </footer>
      </div>
    </ThemeContext.Provider>
  );
}