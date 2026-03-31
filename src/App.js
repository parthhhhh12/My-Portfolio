 // src/App.jsx
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  Award, ChevronDown, Mail, Phone, MapPin, Github, Linkedin,
  Database, Cloud, Calendar, Users, Target, BookOpen, Briefcase,
  CheckCircle2, ArrowUpRight, Layers, BarChart3,
  Brain, Zap, Sparkles, Activity, TrendingUp, Code2,
  Server, GitBranch, Rocket,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ============================
   SECTION IDS
   ============================ */
const SECTION_IDS = ["home", "about", "strengths", "skills", "projects", "certifications", "contact"];

/* ============================
   Animation Variants
   ============================ */
const containerStagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const cardFade = (direction = "up", delay = 0) => ({
  hidden: {
    opacity: 0,
    y: direction === "up" ? 30 : direction === "down" ? -30 : 0,
    x: direction === "left" ? 30 : direction === "right" ? -30 : 0,
    scale: 0.97,
  },
  show: {
    opacity: 1, y: 0, x: 0, scale: 1,
    transition: { type: "spring", stiffness: 70, damping: 14, mass: 0.6, delay },
  },
});

const navFade = {
  hidden: { y: -30, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

/* ============================
   CONTENT
   ============================ */
const QUICK_PROOF = [
  { icon: <Layers size={18} />, label: "Projects", value: "5+ End-to-End Pipelines", color: "from-cyan-500 to-blue-600" },
  { icon: <Award size={18} />, label: "Certifications", value: "Databricks + SQL + GenAI", color: "from-violet-500 to-purple-600" },
  { icon: <Brain size={18} />, label: "Focus", value: "DE • ML • MLOps • GenAI", color: "from-pink-500 to-rose-600" },
];

const WHAT_I_BRING = [
  "End-to-end pipeline development: ingestion → transformation → curated datasets → analytics + ML outputs.",
  "Strong SQL & data modeling mindset (schema design, partitioning, format choices, performance).",
  "Cloud-native stack: Azure (ADF/ADLS/Blob) + Databricks + Snowflake + dbt + MLflow.",
  "ML integration: feature engineering pipelines, model deployment on Databricks, experiment tracking.",
  "GenAI exploration: LLM workflows, RAG pipelines, and prompt engineering with Azure OpenAI.",
  "Quality-first: schema enforcement, clean layers, reproducible runs, orchestration-ready design.",
];

const SKILLS = [
  { name: "Python", proficiency: "Advanced", description: "ETL scripting + ML + data processing", color: "#06b6d4", percent: 92, category: "core" },
  { name: "SQL", proficiency: "Advanced", description: "Joins, windows, modeling, optimization", color: "#22c55e", percent: 90, category: "core" },
  { name: "PySpark", proficiency: "Intermediate", description: "DataFrames, transformations, partitions", color: "#f97316", percent: 78, category: "data" },
  { name: "Microsoft Azure", proficiency: "Intermediate", description: "ADF, ADLS, Blob, Azure OpenAI", color: "#38bdf8", percent: 74, category: "cloud" },
  { name: "Databricks", proficiency: "Intermediate", description: "Notebooks, jobs, MLflow, cluster workflows", color: "#ef4444", percent: 75, category: "data" },
  { name: "Snowflake", proficiency: "Intermediate", description: "Warehousing + analytics queries", color: "#a78bfa", percent: 72, category: "data" },
  { name: "dbt", proficiency: "Intermediate", description: "Models, tests, docs, ELT patterns", color: "#f472b6", percent: 72, category: "data" },
  { name: "Machine Learning", proficiency: "Intermediate", description: "Sklearn, feature pipelines, model eval", color: "#34d399", percent: 70, category: "ml" },
  { name: "MLflow", proficiency: "Intermediate", description: "Experiment tracking, model registry", color: "#fb923c", percent: 68, category: "ml" },
  { name: "MLOps", proficiency: "Learning", description: "CI/CD for ML, model monitoring", color: "#818cf8", percent: 62, category: "ml" },
  { name: "Generative AI", proficiency: "Exploring", description: "LLMs, RAG, Azure OpenAI, prompt eng.", color: "#e879f9", percent: 60, category: "genai" },
  { name: "Delta Lake", proficiency: "Intermediate", description: "Lakehouse concepts + ACID basics", color: "#60a5fa", percent: 72, category: "data" },
];

const SKILL_CATEGORIES = [
  { id: "all", label: "All", icon: <Layers size={14} /> },
  { id: "core", label: "Core", icon: <Code2 size={14} /> },
  { id: "data", label: "Data Engineering", icon: <Database size={14} /> },
  { id: "cloud", label: "Cloud", icon: <Cloud size={14} /> },
  { id: "ml", label: "ML / MLOps", icon: <Brain size={14} /> },
  { id: "genai", label: "GenAI", icon: <Sparkles size={14} /> },
];

const PROJECTS = [
  {
    title: "End-to-End Data Engineering Pipeline",
    subtitle: "Azure Synapse + Snowflake + dbt",
    duration: "Self-Project",
    client: "Personal Development",
    tag: "Data Engineering",
    tagColor: "from-cyan-500 to-blue-600",
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
      "Added reconciliation checks to ensure RAW = CLEAN + ERROR (no silent data loss)",
      "Built analytics-ready marts with dbt + tests to validate data quality",
    ],
    architecture: ["ADLS Gen2 (CSV)", "Azure Synapse Pipelines", "Snowflake (RAW/CLEAN/ERROR)", "dbt (staging → marts + tests)"],
    tech: ["Azure Synapse", "ADLS Gen2", "Snowflake", "dbt", "SQL"],
    repo: "https://github.com/parthhhhh12/-end-to-end-data-engineering-azure-synapse-snowflake.git",
  },
  {
    title: "Batch ETL Pipeline on Azure Databricks",
    subtitle: "NYC Taxi – 10M+ rows",
    duration: "Self-Project",
    client: "Personal Development",
    tag: "Big Data",
    tagColor: "from-orange-500 to-red-600",
    problem: "Raw NYC Taxi trip data is large, messy, and not directly usable for analytics. BI needs clean, typed, aggregated tables.",
    objective: "Build a scalable batch ETL pipeline that produces clean + analytics-ready datasets and vendor-level daily aggregates.",
    approach: [
      "Ingest raw NYC Taxi data from Azure Blob Storage",
      "Clean + enforce schema (type casting, null handling, filtering)",
      "Transform into curated layers (raw → cleaned → aggregated)",
      "Write output in Parquet for fast querying + BI integration",
    ],
    impact: [
      "Processed 10M+ rows using Spark DataFrames with consistent schema enforcement",
      "Delivered curated datasets optimized for analytics and reporting workflows",
      "Designed a clean-layer data model (raw/clean/agg) using DBML",
    ],
    architecture: ["Azure Blob (raw)", "Databricks (PySpark ETL)", "Curated Parquet (cleaned + aggregated)", "BI / Analytics (downstream)"],
    tech: ["Azure Databricks", "PySpark", "Azure Blob Storage", "Parquet", "DBML"],
    repo: "https://github.com/parthhhhh12/Data_Engineering_Personal_Project",
  },
];

const TIMELINE = [
  { year: "2024", title: "Started Data Engineering Journey", desc: "Dove deep into SQL, Python, and cloud fundamentals on Azure.", icon: <Database size={16} />, color: "#06b6d4" },
  { year: "2025", title: "Built First Production Pipelines", desc: "Hands-on with PySpark, Databricks, Snowflake, dbt — end-to-end.", icon: <Server size={16} />, color: "#8b5cf6" },
  { year: "2025", title: "Databricks Certifications", desc: "Earned Data Engineer Associate + Generative AI Engineer Associate.", icon: <Award size={16} />, color: "#f59e0b" },
  { year: "2026", title: "ML & MLOps Integration", desc: "Extended pipelines into ML — feature stores, MLflow, model registry.", icon: <Brain size={16} />, color: "#10b981" },
  { year: "2026", title: "Exploring Generative AI", desc: "RAG pipelines, Azure OpenAI, LLM integration in data workflows.", icon: <Sparkles size={16} />, color: "#ec4899" },
];

/* ============================
   Particle Background
   ============================ */
function ParticleField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let W = window.innerWidth, H = window.innerHeight;
    canvas.width = W; canvas.height = H;

    const COLORS = ["#06b6d4", "#8b5cf6", "#ec4899", "#10b981", "#f97316"];
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.5 + 0.2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, "0");
        ctx.fill();
      });
      // draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(139,92,246,${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W; canvas.height = H;
    };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-40" />;
}

/* ============================
   Glowing Cursor
   ============================ */
function GlowCursor() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [isHover, setIsHover] = useState(false);
  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    const enter = (e) => { if (e.target.closest("button,a")) setIsHover(true); };
    const leave = () => setIsHover(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", enter);
    window.addEventListener("mouseout", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", enter);
      window.removeEventListener("mouseout", leave);
    };
  }, []);
  return (
    <motion.div
      className="fixed z-[9999] pointer-events-none rounded-full mix-blend-screen"
      animate={{ x: pos.x - (isHover ? 20 : 10), y: pos.y - (isHover ? 20 : 10), scale: isHover ? 1.6 : 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 18, mass: 0.5 }}
      style={{ width: isHover ? 40 : 20, height: isHover ? 40 : 20, background: "radial-gradient(circle, rgba(139,92,246,0.8) 0%, rgba(6,182,212,0.4) 60%, transparent 100%)" }}
    />
  );
}

/* ============================
   Typing Animator
   ============================ */
function TypingText({ texts }) {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const target = texts[index];
    let timeout;
    if (!deleting && displayed.length < target.length) {
      timeout = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 60);
    } else if (!deleting && displayed.length === target.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIndex((i) => (i + 1) % texts.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, index, texts]);

  return (
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400">
      {displayed}<span className="animate-pulse">|</span>
    </span>
  );
}

/* ============================
   Floating Badge
   ============================ */
function FloatingBadge({ children, delay = 0 }) {
  return (
    <motion.span
      className="inline-flex items-center gap-1.5 bg-gray-800/80 border border-gray-600/60 text-gray-200 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm"
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 3 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    >
      {children}
    </motion.span>
  );
}

/* ============================
   Skill Card
   ============================ */
function SkillCard({ skill, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      variants={cardFade("up", index * 0.04)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative bg-gray-900/70 rounded-2xl p-5 border border-gray-700/60 backdrop-blur-sm overflow-hidden group cursor-default"
      style={{ boxShadow: hovered ? `0 0 30px ${skill.color}30` : "none", transition: "box-shadow 0.3s" }}
    >
      {/* glow bg */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        style={{ background: `radial-gradient(ellipse at top left, ${skill.color}15, transparent 70%)` }}
      />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3 gap-2">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-white">{skill.name}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{skill.description}</p>
          </div>
          <span
            className="flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border"
            style={{
              color: skill.color,
              borderColor: skill.color + "60",
              background: skill.color + "15",
            }}
          >
            {skill.proficiency}
          </span>
        </div>
        <div className="text-xs mb-1" style={{ color: skill.color + "bb" }}>
          {skill.percent}%
        </div>
        <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${skill.color}, ${skill.color}88)` }}
            initial={{ width: 0 }}
            whileInView={{ width: `${skill.percent}%` }}
            transition={{ duration: 1, delay: index * 0.04, ease: "easeOut" }}
            viewport={{ once: true }}
          />
        </div>
      </div>
    </motion.div>
  );
}

/* ============================
   Section Shell
   ============================ */
function SectionShell({ id, title, subtitle, children, noPad }) {
  return (
    <section id={id} className={`relative ${noPad ? "" : "py-16 sm:py-24"}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {title && (
          <motion.div
            className="text-center mb-10 sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-gray-800/80 border border-gray-700 px-4 py-1.5 rounded-full text-xs font-semibold text-gray-400 mb-4 backdrop-blur-sm"
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              {id.toUpperCase()}
            </motion.div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400">
                {title}
              </span>
            </h2>
            {subtitle && <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">{subtitle}</p>}
          </motion.div>
        )}
        {children}
      </div>
    </section>
  );
}

/* ============================
   Architecture Block
   ============================ */
function ArchitectureBlock({ steps }) {
  return (
    <div className="bg-gray-950/60 border border-gray-700/60 rounded-xl p-4">
      <div className="text-xs font-bold text-gray-400 mb-3 flex items-center gap-2">
        <GitBranch size={13} className="text-cyan-400" /> ARCHITECTURE FLOW
      </div>
      <div className="flex flex-col gap-1">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
              style={{ background: `hsl(${200 + i * 40}, 70%, 50%)` }}
            >
              {i + 1}
            </div>
            <div className="flex-1 bg-gray-800/60 border border-gray-700/40 rounded-lg px-3 py-1.5 text-xs text-gray-200">
              {step}
            </div>
            {i < steps.length - 1 && <div className="absolute ml-3 mt-7 w-0.5 h-3 bg-gray-700" />}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================
   Stats Counter
   ============================ */
function StatCounter({ value, label, icon, color }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const num = parseInt(value);
    let start = 0;
    const step = Math.ceil(num / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= num) { setCount(num); clearInterval(timer); }
      else setCount(start);
    }, 30);
    return () => clearInterval(timer);
  }, [visible, value]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl sm:text-4xl font-black" style={{ color }}>
        {count}{value.includes("+") ? "+" : ""}
      </div>
      <div className="text-xs text-gray-400 mt-1 flex items-center justify-center gap-1">
        {icon} {label}
      </div>
    </div>
  );
}

/* ============================
   MAIN APP
   ============================ */
export default function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [skillFilter, setSkillFilter] = useState("all");
  const [mobileOpen, setMobileOpen] = useState(false);

  const sectionRefs = useRef({});
  const sectionIds = useMemo(() => SECTION_IDS, []);

  const scrollTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(id);
    setMobileOpen(false);
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { threshold: 0.3 }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) { observer.observe(el); sectionRefs.current[id] = el; }
    });
    return () => { window.removeEventListener("scroll", onScroll); observer.disconnect(); };
  }, [sectionIds]);

  const filteredSkills = skillFilter === "all" ? SKILLS : SKILLS.filter(s => s.category === skillFilter);

  return (
    <div className="min-h-screen bg-[#050510] text-white overflow-x-hidden" style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #050510; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #8b5cf6, #06b6d4); border-radius: 4px; }
        .noise::after {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 1;
          opacity: 0.4;
        }
        .glow-text { text-shadow: 0 0 40px rgba(139,92,246,0.5), 0 0 80px rgba(6,182,212,0.3); }
        .card-hover { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .card-hover:hover { transform: translateY(-4px); }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .gradient-animate {
          background-size: 200% 200%;
          animation: gradientShift 4s ease infinite;
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>

      <ParticleField />
      <GlowCursor />

      {/* Gradient mesh background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-10 blur-[120px]" style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }} />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] rounded-full opacity-10 blur-[100px]" style={{ background: "radial-gradient(circle, #06b6d4, transparent)" }} />
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full opacity-8 blur-[80px]" style={{ background: "radial-gradient(circle, #ec4899, transparent)" }} />
      </div>

      {/* ===== NAV ===== */}
      <motion.nav
        variants={navFade}
        initial="hidden"
        animate="show"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? "bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/60 shadow-lg shadow-violet-900/10" : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <motion.div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => scrollTo("home")}
              whileHover={{ scale: 1.04 }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #8b5cf6, #06b6d4)" }}>
                <Database size={16} className="text-white" />
              </div>
              <span className="font-black text-lg tracking-tight">Parth<span className="text-violet-400">.</span></span>
            </motion.div>

            <div className="hidden md:flex items-center gap-1">
              {SECTION_IDS.map((s) => (
                <motion.button
                  key={s}
                  onClick={() => scrollTo(s)}
                  className={`capitalize px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    activeSection === s
                      ? "text-white bg-violet-600/30 border border-violet-500/40"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/60"
                  }`}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {s}
                </motion.button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <motion.a
                href="/My_Latest_Data_Engineering.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg border border-violet-500/60 text-violet-300 hover:bg-violet-600/20 transition-all"
                whileHover={{ scale: 1.05 }}
              >
                Resume <ArrowUpRight size={13} />
              </motion.a>
              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 rounded-lg bg-gray-800/80 text-white"
                onClick={() => setMobileOpen(true)}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
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
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[998] bg-gray-950/95 backdrop-blur-xl"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              className="fixed right-0 top-0 bottom-0 w-72 z-[999] bg-gray-950 border-l border-gray-800 p-6 flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="font-black text-lg">Parth<span className="text-violet-400">.</span></span>
                <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg bg-gray-800 text-white">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <nav className="flex flex-col gap-2">
                {SECTION_IDS.map((s) => (
                  <button
                    key={s}
                    onClick={() => scrollTo(s)}
                    className={`text-left px-4 py-3 rounded-xl capitalize font-medium transition-all ${
                      activeSection === s ? "bg-violet-600 text-white" : "text-gray-300 hover:bg-gray-800"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </nav>
              <div className="mt-auto">
                <a href="/My_Latest_Data_Engineering.pdf" target="_blank" rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 border border-violet-500/60 text-violet-300 py-3 rounded-xl font-bold text-sm">
                  View Resume <ArrowUpRight size={14} />
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ===== HERO ===== */}
      <section id="home" className="relative min-h-screen flex items-center justify-center pt-16 px-4 overflow-hidden">
        {/* Grid overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(139,92,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        <div className="relative z-10 max-w-5xl w-full text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-6"
          >
            <div className="relative inline-block">
              <motion.div
                className="absolute inset-0 rounded-full blur-2xl opacity-60"
                style={{ background: "radial-gradient(circle, #8b5cf6, #06b6d4)" }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <img
                src="/img.jpeg"
                alt="Parth"
                className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-2 border-violet-500/60 shadow-2xl"
              />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-2 border-gray-950 flex items-center justify-center">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-violet-500" />
            <span className="text-xs font-bold text-violet-400 tracking-widest uppercase">Available for Hire</span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-violet-500" />
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-none glow-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            Parth 
          </motion.h1>

          <motion.div
            className="mt-3 text-lg sm:text-2xl md:text-3xl font-bold h-10 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            <TypingText texts={[
              "Data and AI Engineer",
              "MLOps Practitioner",
              "Generative AI Explorer",
              "Pipeline Builder",
            ]} />
          </motion.div>

          <motion.p
            className="mt-5 text-sm sm:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            I build scalable data pipelines, ML-integrated workflows, and GenAI-powered solutions using cloud-native tools.
            From raw ingestion to model deployment — end to end.
          </motion.p>

          {/* Quick Proof Cards */}
          <motion.div
            className="mt-8 grid sm:grid-cols-3 gap-3 max-w-3xl mx-auto"
            initial="hidden" animate="show" variants={containerStagger}
          >
            {QUICK_PROOF.map((p, i) => (
              <motion.div
                key={p.label}
                variants={cardFade("up", i * 0.07)}
                className="relative overflow-hidden bg-gray-900/60 border border-gray-700/60 rounded-2xl p-4 backdrop-blur-sm card-hover"
              >
                <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${p.color}`} />
                <div className={`w-9 h-9 rounded-xl mb-3 flex items-center justify-center bg-gradient-to-br ${p.color} bg-opacity-20`}>
                  {p.icon}
                </div>
                <div className="text-xs text-gray-500 mb-0.5">{p.label}</div>
                <div className="text-sm font-bold text-white">{p.value}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Floating tech badges */}
          <motion.div
            className="mt-6 flex flex-wrap gap-2 justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            {["Azure", "Databricks", "Snowflake", "dbt", "MLflow", "PySpark", "GenAI", "Python"].map((t, i) => (
              <FloatingBadge key={t} delay={i * 0.3}>
                {t}
              </FloatingBadge>
            ))}
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            className="mt-8 flex flex-col sm:flex-row gap-3 justify-center items-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.button
              onClick={() => scrollTo("projects")}
              className="w-full sm:w-auto relative overflow-hidden group px-7 py-3 rounded-xl font-bold text-sm text-white"
              style={{ background: "linear-gradient(135deg, #8b5cf6, #06b6d4)" }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Rocket size={16} /> View Case Studies
              </span>
            </motion.button>
            <motion.a
              href="/My_Latest_Data_Engineering.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-sm border border-gray-600/60 text-gray-300 hover:border-violet-500/60 hover:text-white inline-flex items-center justify-center gap-2 transition-all"
              whileHover={{ scale: 1.04 }}
            >
              Resume <ArrowUpRight size={15} />
            </motion.a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-xs text-gray-600 tracking-widest uppercase">Scroll</span>
          <ChevronDown size={18} className="text-gray-600" />
        </motion.div>
      </section>

      {/* ===== STATS BAND ===== */}
      <div className="relative z-10 py-10 border-y border-gray-800/60" style={{ background: "linear-gradient(90deg, rgba(139,92,246,0.08), rgba(6,182,212,0.08))" }}>
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-8">
          <StatCounter value="10" label="M+ Rows Processed" icon={<BarChart3 size={12} />} color="#06b6d4" />
          <StatCounter value="3" label="Cloud Certifications" icon={<Award size={12} />} color="#8b5cf6" />
          <StatCounter value="5" label="Data Pipelines Built" icon={<Activity size={12} />} color="#ec4899" />
          <StatCounter value="12" label="Technologies Mastered" icon={<Code2 size={12} />} color="#10b981" />
        </div>
      </div>

      {/* ===== ABOUT ===== */}
      <SectionShell id="about" title="About Me" subtitle="Data engineer by skill, ML engineer by curiosity, GenAI enthusiast by drive.">
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          <motion.div
            className="space-y-4"
            initial="hidden" whileInView="show" variants={containerStagger} viewport={{ once: true }}
          >
            <motion.div variants={cardFade("up")} className="bg-gray-900/60 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm card-hover">
              <h3 className="font-bold text-base mb-3 flex items-center gap-2 text-cyan-300">
                <Target size={16} /> Professional Summary
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Data Engineer with hands-on experience designing scalable pipelines using PySpark, Databricks, Azure, Snowflake, and dbt.
                I'm extending that into ML — building feature pipelines, experiment tracking with MLflow, and exploring GenAI integrations.
                I focus on clean data layers, schema enforcement, and analytics-ready outputs.
              </p>
            </motion.div>
            <motion.div variants={cardFade("up", 0.07)} className="bg-gray-900/60 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm card-hover">
              <h3 className="font-bold text-base mb-3 flex items-center gap-2 text-green-300">
                <BookOpen size={16} /> Education
              </h3>
              <p className="font-bold text-sm">Bachelor of Technology — Computer Science Engineering</p>
              <p className="text-gray-400 text-sm">University of Petroleum and Energy Studies (UPES)</p>
              <p className="text-violet-400 text-sm mt-1 font-semibold">Specialization: Cloud Computing and DevOps</p>
            </motion.div>
          </motion.div>

          {/* Timeline */}
          <motion.div
            className="bg-gray-900/60 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="font-bold text-base mb-5 flex items-center gap-2 text-pink-300">
              <TrendingUp size={16} /> My Journey
            </h3>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-violet-600 via-cyan-500 to-pink-500 opacity-40" />
              <div className="space-y-5">
                {TIMELINE.map((item, i) => (
                  <motion.div
                    key={i}
                    className="relative flex gap-4 pl-10"
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <div
                      className="absolute left-2 w-5 h-5 rounded-full flex items-center justify-center border-2 border-gray-950 z-10"
                      style={{ background: item.color, top: "2px" }}
                    >
                      <span style={{ color: "white", transform: "scale(0.65)" }}>{item.icon}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black" style={{ color: item.color }}>{item.year}</span>
                        <span className="text-xs font-bold text-white">{item.title}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </SectionShell>

      {/* ===== WHAT I BRING ===== */}
      <SectionShell id="strengths" title="What I Bring" subtitle="A full-stack data + ML profile built for modern cloud teams.">
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            className="bg-gray-900/60 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm card-hover"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          >
            <h3 className="text-base font-bold text-cyan-300 mb-4 flex items-center gap-2">
              <CheckCircle2 size={16} /> Core Strengths
            </h3>
            <div className="space-y-3">
              {WHAT_I_BRING.map((x, i) => (
                <motion.div
                  key={i}
                  className="flex gap-3 text-sm text-gray-300"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                >
                  <span className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0" style={{ background: `hsl(${200 + i * 30}, 80%, 60%)` }} />
                  {x}
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div className="space-y-4" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            {/* Roles targeting */}
            <div className="bg-gray-900/60 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm card-hover">
              <h3 className="text-base font-bold text-violet-300 mb-4 flex items-center gap-2">
                <Briefcase size={16} /> Roles I'm Targeting
              </h3>
              <div className="flex flex-wrap gap-2">
                {["Data and AI Engineer", "Data and AI Architect", "AI Platform Engineer", "AI Infrastructure Engineer"].map((r, i) => (
                  <motion.span
                    key={r}
                    className="px-3 py-1.5 rounded-full text-xs font-bold border"
                    style={{
                      borderColor: `hsl(${200 + i * 35}, 70%, 50%)40`,
                      color: `hsl(${200 + i * 35}, 80%, 70%)`,
                      background: `hsl(${200 + i * 35}, 70%, 50%)15`,
                    }}
                    whileHover={{ scale: 1.07 }}
                  >
                    {r}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* GenAI focus card */}
            <div className="relative overflow-hidden bg-gray-900/60 border border-pink-500/30 rounded-2xl p-6 backdrop-blur-sm">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-violet-500 to-pink-500" />
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #ec4899, #8b5cf6)" }}>
                  <Sparkles size={15} className="text-white" />
                </div>
                <h3 className="text-sm font-bold text-pink-300">Currently Exploring</h3>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                RAG pipelines with Azure OpenAI, LLM-powered data quality checks, and integrating GenAI into ETL workflows for smarter transformations.
              </p>
              <div className="mt-3 flex gap-2">
                {["RAG", "Azure OpenAI", "LangChain", "Vector DBs"].map(t => (
                  <span key={t} className="text-[10px] bg-pink-500/10 border border-pink-500/30 text-pink-300 px-2 py-0.5 rounded-full font-medium">{t}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </SectionShell>

      {/* ===== SKILLS ===== */}
      <SectionShell id="skills" title="Skills & Stack" subtitle="From data pipelines to ML models to GenAI — the full modern data engineering stack.">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {SKILL_CATEGORIES.map(cat => (
            <motion.button
              key={cat.id}
              onClick={() => setSkillFilter(cat.id)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                skillFilter === cat.id
                  ? "text-white border border-violet-400/60"
                  : "text-gray-400 border border-gray-700/50 hover:border-gray-500 hover:text-gray-200"
              }`}
              style={skillFilter === cat.id ? { background: "linear-gradient(135deg, #8b5cf680, #06b6d440)" } : {}}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              {cat.icon} {cat.label}
            </motion.button>
          ))}
        </div>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12"
          initial="hidden" whileInView="show" variants={containerStagger} viewport={{ once: true }}
          key={skillFilter}
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill, idx) => (
              <motion.div key={skill.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: idx * 0.03 }}>
                <SkillCard skill={skill} index={idx} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Stack pillars */}
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
          initial="hidden" whileInView="show" variants={containerStagger} viewport={{ once: true }}
        >
          {[
            { icon: <Cloud size={24} />, title: "Cloud", items: ["ADF", "ADLS Gen2", "Azure Blob", "Azure OpenAI"], color: "#06b6d4" },
            { icon: <Database size={24} />, title: "Data Engineering", items: ["PySpark", "Databricks", "Delta Lake", "Parquet"], color: "#8b5cf6" },
            { icon: <Brain size={24} />, title: "ML / MLOps", items: ["MLflow", "Sklearn", "Feature Pipelines", "Model Registry"], color: "#10b981" },
            { icon: <Sparkles size={24} />, title: "GenAI", items: ["Azure OpenAI", "RAG", "LangChain", "Prompt Eng."], color: "#ec4899" },
          ].map((block, i) => (
            <motion.div
              key={block.title}
              variants={cardFade("up", i * 0.08)}
              className="relative bg-gray-900/60 border border-gray-700/50 rounded-2xl p-5 text-center backdrop-blur-sm card-hover overflow-hidden"
            >
              <div className="absolute inset-x-0 bottom-0 h-0.5 opacity-60" style={{ background: `linear-gradient(90deg, transparent, ${block.color}, transparent)` }} />
              <div className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ background: `${block.color}20`, color: block.color }}>
                {block.icon}
              </div>
              <h3 className="text-sm font-black mb-3" style={{ color: block.color }}>{block.title}</h3>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {block.items.map(item => (
                  <span key={item} className="bg-gray-800/60 border border-gray-700/40 text-gray-300 px-2 py-0.5 rounded-full text-[11px] font-medium">{item}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </SectionShell>

      {/* ===== PROJECTS ===== */}
      <SectionShell id="projects" title="Case Studies" subtitle="End-to-end pipelines, ML integrations, and data engineering patterns in production-style.">
        <div className="space-y-8">
          {PROJECTS.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative bg-gray-900/60 border border-gray-700/50 rounded-3xl p-6 sm:p-8 backdrop-blur-sm overflow-hidden"
            >
              {/* Top gradient line */}
              <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${p.tagColor}`} />

              <div className="flex flex-col lg:flex-row lg:items-start gap-4 mb-6">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`text-[11px] font-black px-3 py-1 rounded-full bg-gradient-to-r ${p.tagColor} text-white`}>
                      {p.tag}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1"><Calendar size={11} /> {p.duration}</span>
                    <span className="text-xs text-gray-500 flex items-center gap-1"><Users size={11} /> {p.client}</span>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-black text-white leading-tight">{p.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{p.subtitle}</p>
                </div>
                <motion.a
                  href={p.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 inline-flex items-center gap-2 bg-gray-800 border border-gray-600 text-gray-200 px-4 py-2 rounded-xl text-xs font-bold hover:border-violet-500/60 hover:text-violet-300 transition-all"
                  whileHover={{ scale: 1.05 }}
                >
                  <Github size={14} /> GitHub <ArrowUpRight size={12} />
                </motion.a>
              </div>

              <div className="grid lg:grid-cols-2 gap-5">
                <div className="space-y-4">
                  <div className="bg-gray-950/50 border border-gray-700/40 rounded-xl p-4">
                    <div className="text-xs font-bold text-red-400 mb-2 flex items-center gap-1.5"><Target size={11} /> PROBLEM</div>
                    <p className="text-xs text-gray-300 leading-relaxed">{p.problem}</p>
                  </div>
                  <div className="bg-gray-950/50 border border-gray-700/40 rounded-xl p-4">
                    <div className="text-xs font-bold text-cyan-400 mb-2 flex items-center gap-1.5"><Zap size={11} /> OBJECTIVE</div>
                    <p className="text-xs text-gray-300 leading-relaxed">{p.objective}</p>
                  </div>
                  <ArchitectureBlock steps={p.architecture} />
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-950/50 border border-gray-700/40 rounded-xl p-4">
                    <div className="text-xs font-bold text-violet-400 mb-3 flex items-center gap-1.5"><Code2 size={11} /> WHAT I BUILT</div>
                    <div className="space-y-2">
                      {p.approach.map((x, idx) => (
                        <div key={idx} className="flex gap-2.5 text-xs text-gray-300">
                          <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-400" />
                          {x}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gray-950/50 border border-gray-700/40 rounded-xl p-4">
                    <div className="text-xs font-bold text-green-400 mb-3 flex items-center gap-1.5"><CheckCircle2 size={11} /> IMPACT</div>
                    <div className="space-y-2">
                      {p.impact.map((x, idx) => (
                        <div key={idx} className="flex gap-2.5 text-xs text-gray-300">
                          <CheckCircle2 size={13} className="flex-shrink-0 text-green-400 mt-0.5" />
                          {x}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-400 mb-2">TECH STACK</div>
                    <div className="flex flex-wrap gap-1.5">
                      {p.tech.map(t => (
                        <span key={t} className="text-[11px] bg-gray-800/80 border border-gray-700/50 text-gray-200 px-2.5 py-1 rounded-lg font-medium">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </SectionShell>

      {/* ===== CERTIFICATIONS ===== */}
      <SectionShell id="certifications" title="Certifications" subtitle="Validated skills across data engineering and AI.">
        <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {[
            { href: "https://credentials.databricks.com/80290364-9760-4912-80bb-628ecb05f2d6#acc.1QyUwPgn", icon: <Award size={22} />, title: "Databricks Certified", sub: "Data Engineer Associate", color: "#ef4444" },
            { href: "https://credentials.databricks.com/e77bcf6d-f559-47e7-beca-608373a5660b#acc.mVhSLHf9", icon: <Sparkles size={22} />, title: "Databricks Certified", sub: "Generative AI Engineer Associate", color: "#ec4899" },
            { href: "https://www.hackerrank.com/certificates/731721820af3", icon: <Database size={22} />, title: "HackerRank SQL", sub: "Advanced", color: "#22c55e" },
            { href: "https://www.hackerrank.com/certificates/6f58d3da3e47", icon: <Database size={22} />, title: "HackerRank SQL", sub: "Intermediate", color: "#06b6d4" },
          ].map((cert, i) => (
            <motion.a
              key={i}
              href={cert.href}
              target="_blank"
              rel="noopener noreferrer"
              className="relative overflow-hidden bg-gray-900/60 border border-gray-700/50 rounded-2xl p-5 backdrop-blur-sm flex items-center gap-4 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ scale: 1.03 }}
            >
              <div className="absolute inset-x-0 top-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${cert.color}, transparent)` }} />
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${cert.color}20`, color: cert.color }}>
                {cert.icon}
              </div>
              <div>
                <div className="text-sm font-black text-white">{cert.title}</div>
                <div className="text-xs text-gray-400">{cert.sub}</div>
              </div>
              <ArrowUpRight size={16} className="ml-auto text-gray-600 group-hover:text-violet-400 transition-colors" />
            </motion.a>
          ))}
        </div>
      </SectionShell>

      {/* ===== CONTACT ===== */}
      <SectionShell id="contact" title="Let's Connect" subtitle="Open to data engineering and ML engineering roles. Let's build something great together.">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <p className="text-sm text-gray-400 leading-relaxed">
              I'm actively seeking roles where I can apply cloud-native data engineering, ML pipeline design, and my growing GenAI skills. If you're building a modern data team — let's talk.
            </p>
            {[
              { icon: <Mail size={16} />, label: "parthsingh1253@gmail.com", href: "mailto:parthsingh1253@gmail.com", color: "#06b6d4" },
              { icon: <Phone size={16} />, label: "+91 8527713603", href: "tel:+918527713603", color: "#10b981" },
              { icon: <MapPin size={16} />, label: "Gurugram, Haryana, India", color: "#f97316" },
              { icon: <Github size={16} />, label: "GitHub Profile", href: "https://github.com/parthhhhh12", color: "#a78bfa" },
              { icon: <Linkedin size={16} />, label: "LinkedIn Profile", href: "https://www.linkedin.com/in/singh05e/", color: "#38bdf8" },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-4 bg-gray-900/60 border border-gray-700/50 rounded-xl p-4 backdrop-blur-sm"
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ x: 4 }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}20`, color: item.color }}>
                  {item.icon}
                </div>
                {item.href ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-300 hover:text-white transition-colors">{item.label}</a>
                ) : (
                  <span className="text-sm text-gray-300">{item.label}</span>
                )}
              </motion.div>
            ))}
          </motion.div>

          <motion.form
            action="https://formspree.io/f/xgvnlvkd"
            method="POST"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gray-900/60 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm space-y-4"
          >
            <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-60" />
            {[
              { id: "name", label: "Name", type: "text", placeholder: "Your name" },
              { id: "email", label: "Email", type: "email", placeholder: "you@example.com" },
            ].map(field => (
              <div key={field.id}>
                <label htmlFor={field.id} className="text-xs font-bold text-gray-400 mb-1.5 block uppercase tracking-wider">{field.label}</label>
                <input
                  type={field.type} name={field.id} id={field.id} required
                  placeholder={field.placeholder}
                  className="w-full px-4 py-2.5 bg-gray-950/60 border border-gray-700/60 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/70 focus:ring-1 focus:ring-violet-500/30 transition-all"
                />
              </div>
            ))}
            <div>
              <label htmlFor="message" className="text-xs font-bold text-gray-400 mb-1.5 block uppercase tracking-wider">Message</label>
              <textarea
                name="message" id="message" rows={4} required
                placeholder="Tell me about the role or project..."
                className="w-full px-4 py-2.5 bg-gray-950/60 border border-gray-700/60 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/70 focus:ring-1 focus:ring-violet-500/30 transition-all resize-none"
              />
            </div>
            <motion.button
              type="submit"
              className="w-full py-3 rounded-xl font-black text-sm text-white relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #8b5cf6, #06b6d4)" }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Send Message
            </motion.button>
            <p className="text-xs text-gray-500 text-center">Tip: Mention the role name — I'll respond faster.</p>
          </motion.form>
        </div>
      </SectionShell>

      {/* ===== FOOTER ===== */}
      <footer className="py-10 border-t border-gray-800/60">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #8b5cf6, #06b6d4)" }}>
              <Database size={13} className="text-white" />
            </div>
            <span className="text-sm font-black">Parth<span className="text-violet-400">.</span></span>
          </div>
          <p className="text-xs text-gray-600">© 2026 Parth · Data Engineer · ML + GenAI Explorer</p>
          <div className="flex items-center gap-3">
            <a href="https://github.com/parthhhhh12" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-white transition-colors"><Github size={16} /></a>
            <a href="https://www.linkedin.com/in/singh05e/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-cyan-400 transition-colors"><Linkedin size={16} /></a>
            <a href="mailto:parthsingh1253@gmail.com" className="text-gray-600 hover:text-violet-400 transition-colors"><Mail size={16} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
