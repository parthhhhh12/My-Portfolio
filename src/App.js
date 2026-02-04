// src/App.jsx
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  Award,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Database,
  Cloud,
  Calendar,
  Users,
  Target,
  BookOpen,
  Briefcase,
  Sun,
  Moon,
  CheckCircle2,
  ArrowUpRight,
  Layers,
  BarChart3,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ============================
   Constants (IMPORTANT for Vercel/CI build)
   - Kept outside component to avoid exhaustive-deps warnings
   ============================ */

const SECTION_IDS = ["home", "about", "strengths", "skills", "projects", "certifications", "contact"];

/* ============================
   Animation Variants
   ============================ */

const containerStagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.12 },
  },
};

const cardFade = (direction = "up", delay = 0) => ({
  hidden: {
    opacity: 0,
    y: direction === "up" ? 24 : direction === "down" ? -24 : 0,
    x: direction === "left" ? 24 : direction === "right" ? -24 : 0,
    scale: 0.985,
  },
  show: {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 80, damping: 12, mass: 0.5, delay },
  },
});

const navFade = {
  hidden: { y: -28, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

const floatY = {
  animate: { y: [0, 8, 0] },
  transition: { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
};

/* ============================
   Content
   ============================ */

const QUICK_PROOF = [
  { icon: <Layers size={18} />, label: "Projects", value: "3+ Data Pipelines" },
  { icon: <Award size={18} />, label: "Certifications", value: "Databricks + SQL" },
  { icon: <BarChart3 size={18} />, label: "Strength", value: "ETL/ELT + Warehousing" },
];

const WHAT_I_BRING = [
  "Hands-on pipeline development: ingestion → transformation → curated datasets → analytics outputs.",
  "Strong SQL & data modeling mindset (schema design, partitioning, format choices, performance).",
  "Cloud-native stack exposure: Azure (ADF/ADLS/Blob) + Databricks + Snowflake + dbt.",
  "Quality-first approach: schema enforcement, clean layers, reproducible runs, orchestration-ready design.",
];

const SKILLS = [
  { name: "Python", proficiency: "Advanced", description: "ETL scripting + data processing", colorClass: "bg-blue-500", dots: 5, percent: 92 },
  { name: "SQL", proficiency: "Advanced", description: "Joins, windows, modeling, optimization", colorClass: "bg-green-500", dots: 5, percent: 90 },
  { name: "PySpark", proficiency: "Intermediate", description: "DataFrames, transformations, partitions", colorClass: "bg-orange-500", dots: 4, percent: 78 },
  { name: "Microsoft Azure", proficiency: "Intermediate", description: "ADF, ADLS, Blob, deployment basics", colorClass: "bg-cyan-500", dots: 4, percent: 74 },
  { name: "Databricks", proficiency: "Intermediate", description: "Notebooks, jobs, cluster workflows", colorClass: "bg-red-500", dots: 4, percent: 75 },
  { name: "Snowflake", proficiency: "Intermediate", description: "Warehousing + analytics queries", colorClass: "bg-purple-500", dots: 4, percent: 72 },
  { name: "dbt", proficiency: "Intermediate", description: "Models, tests, docs, ELT patterns", colorClass: "bg-purple-500", dots: 4, percent: 72 },
  { name: "Delta Lake", proficiency: "Intermediate", description: "Lakehouse concepts + ACID basics", colorClass: "bg-purple-500", dots: 4, percent: 72 },
  { name: "Java", proficiency: "Intermediate", description: "OOP fundamentals", colorClass: "bg-pink-500", dots: 3, percent: 60 },
];

const PROJECTS = [
  {
    title: "Batch ETL Pipeline on Azure Databricks (NYC Taxi – 10M+ rows)",
    duration: "Self-Project",
    client: "Personal Development",
    problem:
      "Raw NYC Taxi trip data is large, messy, and not directly usable for analytics. BI needs clean, typed, aggregated tables.",
    objective:
      "Build a scalable batch ETL pipeline that produces clean + analytics-ready datasets and vendor-level daily aggregates.",
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
    architecture: [
      "Azure Blob (raw)",
      "Databricks (PySpark ETL)",
      "Curated Parquet (cleaned + aggregated)",
      "BI / Analytics (downstream)",
    ],
    tech: ["Azure Databricks", "PySpark", "Azure Blob Storage", "Parquet", "DBML"],
    repo: "https://github.com/parthhhhh12/Data_Engineering_Personal_Project",
  },
  {
    title: "End-to-End Data Engineering Pipeline (Azure Synapse + Snowflake + dbt)",
    duration: "Self-Project",
    client: "Personal Development",
    problem:
      "Manual ingestion and inconsistent validation lead to unreliable analytics. Teams need automated pipelines with clean/error separation and tested transformations.",
    objective:
      "Build an event-driven, production-style pipeline that ingests CSV files from ADLS Gen2, loads RAW data into Snowflake, separates CLEAN/ERROR records, and builds analytics-ready marts using dbt with tests.",
    approach: [
      "Storage Event Trigger to automatically detect new files in ADLS Gen2",
      "Dynamic Synapse pipeline using Get Metadata + ForEach for file iteration",
      "Copy Activity to load each file into Snowflake RAW tables",
      "Validation logic to split records into CLEAN and ERROR layers with reconciliation",
      "dbt models (staging → marts) with tests for data quality and business rules",
    ],
    impact: [
      "Implemented RAW/CLEAN/ERROR layering in Snowflake for reliable downstream analytics",
      "Automated ingestion with event-based trigger + dynamic file processing (no hardcoded file list)",
      "Added reconciliation checks to ensure RAW = CLEAN + ERROR (no silent data loss)",
      "Built analytics-ready marts with dbt + tests to validate data quality",
    ],
    architecture: [
      "ADLS Gen2 (CSV)",
      "Azure Synapse Pipelines (trigger + dynamic loop)",
      "Snowflake (RAW/CLEAN/ERROR)",
      "dbt (staging → marts + tests)",
    ],
    tech: ["Azure Synapse", "ADLS Gen2", "Snowflake", "dbt", "SQL"],
    repo: "https://github.com/parthhhhh12/-end-to-end-data-engineering-azure-synapse-snowflake.git",
  },
];

/* ============================
   Small UI Components
   ============================ */

function Badge({ children }) {
  return (
    <span className="bg-blue-600/90 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
      {children}
    </span>
  );
}

function ProofCard({ icon, label, value }) {
  return (
    <div className="bg-gray-800/70 border border-gray-700 rounded-2xl p-4 flex items-center gap-3 shadow">
      <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-300">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xs text-gray-400">{label}</div>
        <div className="font-semibold text-sm sm:text-base truncate">{value}</div>
      </div>
    </div>
  );
}

function SectionShell({ id, title, subtitle, children, bg }) {
  return (
    <section id={id} className={`py-12 sm:py-20 ${bg ? bg : ""}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-center text-blue-300"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {title}
        </motion.h2>
        {subtitle ? (
          <p className="mt-3 text-center text-gray-300 max-w-3xl mx-auto">{subtitle}</p>
        ) : null}
        <div className="mt-8 sm:mt-12">{children}</div>
      </div>
    </section>
  );
}

function ArchitectureBlock({ steps }) {
  return (
    <div className="bg-gray-900/40 border border-gray-600 rounded-xl p-4 overflow-x-auto">
      <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-200">
        <Cloud size={16} className="text-blue-300" />
        Architecture
      </div>
      <pre className="text-xs sm:text-sm text-gray-200 leading-relaxed whitespace-pre">
{`[ ${steps[0]} ]
        |
        v
[ ${steps[1]} ]
        |
        v
[ ${steps[2]} ]
        |
        v
[ ${steps[3]} ]`}
      </pre>
    </div>
  );
}

/* ============================
   Main App
   ============================ */

export default function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [dark, setDark] = useState(true);

  const sectionRefs = useRef({});

  // keep a stable list to satisfy linting + avoid re-creating arrays
  const sectionIds = useMemo(() => SECTION_IDS, []);

  const scrollTo = useCallback(
    (id) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(id);
    },
    [setActiveSection]
  );

  // Scroll + intersection observer (lint-safe)
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: [0.2, 0.5, 0.8] }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
        sectionRefs.current[id] = el;
      }
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, [sectionIds]);

  useEffect(() => {
    const html = document.documentElement;
    if (dark) html.classList.add("dark");
    else html.classList.remove("dark");
  }, [dark]);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${dark ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      {/* ---------- NAV ---------- */}
      <motion.nav
        variants={navFade}
        initial="hidden"
        animate="show"
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-sm transition-all duration-300 ${
          isScrolled ? (dark ? "bg-gray-900/80" : "bg-white/70 shadow-md") : "bg-transparent"
        }`}
        aria-label="Main navigation"
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow">
                <Database className="text-white" size={18} />
              </div>
              <span className="font-bold text-lg">Parth</span>
            </div>

            <div className="hidden md:flex items-center gap-6">
              {SECTION_IDS.map((s) => (
                <button
                  key={s}
                  onClick={() => scrollTo(s)}
                  className={`capitalize px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors ${
                    activeSection === s ? "text-blue-400 font-semibold" : "text-gray-300 hover:text-blue-400"
                  }`}
                >
                  {s}
                </button>
              ))}

              <button
                onClick={() => setDark((d) => !d)}
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="Toggle theme"
              >
                {dark ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>

            <div className="md:hidden">
              <MobileMenu onNavigate={scrollTo} activeSection={activeSection} dark={dark} setDark={setDark} />
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ---------- HERO ---------- */}
      <section id="home" className="min-h-screen flex items-center justify-center relative pt-20 px-4">
        <motion.div
          className="max-w-5xl text-center w-full"
          initial={{ opacity: 0, y: 20, scale: 0.995 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.img
            src="/img.jpeg"
            alt="Parth"
            className="w-28 h-28 sm:w-36 sm:h-36 rounded-full mx-auto object-cover shadow-2xl border-4 border-blue-600"
            whileHover={{ scale: 1.06, rotate: 1 }}
            transition={{ type: "spring", stiffness: 220 }}
          />

          <motion.h1
            className="mt-6 text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight px-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            Parth
          </motion.h1>

          <motion.h2
            className="mt-2 text-lg sm:text-xl md:text-2xl text-blue-300 px-2 font-semibold"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            Data Engineer • Azure • Databricks • Snowflake • dbt
          </motion.h2>

          <motion.p className="mt-4 text-sm sm:text-base text-gray-300 max-w-3xl mx-auto px-4">
            I build scalable data pipelines and analytics-ready datasets using cloud-native tools. Strong in SQL + PySpark, with hands-on
            experience across ingestion, transformation, and curated data layers.
          </motion.p>

          <motion.div
            className="mt-6 grid sm:grid-cols-3 gap-3 max-w-4xl mx-auto px-4"
            initial="hidden"
            animate="show"
            variants={containerStagger}
          >
            {QUICK_PROOF.map((p, idx) => (
              <motion.div key={p.label} variants={cardFade("up", idx * 0.06)}>
                <ProofCard icon={p.icon} label={p.label} value={p.value} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            <button
              onClick={() => scrollTo("projects")}
              className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-transform transform hover:-translate-y-0.5 shadow-lg"
              aria-label="View projects"
            >
              <Briefcase size={18} />
              View Case Studies
            </button>

            <a
              href="/My_Data_Engineering_Resume-4.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto border border-gray-500 px-6 py-3 rounded-lg font-semibold inline-flex items-center justify-center gap-2 hover:border-white"
            >
              View Resume <ArrowUpRight size={16} />
            </a>
          </motion.div>
        </motion.div>

        <motion.div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden sm:block" {...floatY}>
          <ChevronDown size={28} className="text-gray-400" />
        </motion.div>
      </section>

      {/* ---------- ABOUT ---------- */}
      <SectionShell
        id="about"
        title="About Me"
        subtitle="A quick overview of what I do, what I’ve built, and what I’m aiming for next."
        bg="bg-gray-800"
      >
        <motion.div className="grid md:grid-cols-2 gap-6 sm:gap-8" initial="hidden" whileInView="show" variants={containerStagger} viewport={{ once: true }}>
          <motion.div variants={cardFade("up", 0.05)} className="space-y-4 sm:space-y-6">
            <div className="bg-gray-700 rounded-xl p-4 sm:p-6 shadow">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 flex items-center gap-3">
                <Target className="text-blue-400 flex-shrink-0" size={20} />
                Professional Summary
              </h3>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                Data Engineer with hands-on experience designing, building, and optimizing scalable pipelines using PySpark, Databricks,
                Microsoft Azure, Snowflake, and dbt. I focus on clean data layers, schema enforcement, and building analytics-ready datasets
                for reporting and BI use cases.
              </p>
            </div>

            <div className="bg-gray-700 rounded-xl p-4 sm:p-6 shadow">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 flex items-center gap-3">
                <BookOpen className="text-green-400 flex-shrink-0" size={20} />
                Education
              </h3>
              <div className="text-sm sm:text-base">
                <p className="font-semibold">Bachelor of Technology</p>
                <p className="text-gray-300">Computer Science Engineering</p>
                <p className="text-gray-400">University of Petroleum and Energy Studies (UPES)</p>
                <p className="text-blue-400">Specialization: Cloud Computing</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={cardFade("up", 0.12)} className="space-y-4 sm:space-y-6">
            <div className="bg-gray-700 rounded-xl p-4 sm:p-6 shadow">
              <h3 className="text-lg sm:text-xl font-semibold mb-3">What I enjoy</h3>
              <p className="text-sm sm:text-base text-gray-300">
                Problem solving, building reliable systems, and turning messy data into clean datasets that stakeholders can trust. I enjoy
                learning new tools in the modern data stack and improving pipeline reliability.
              </p>
            </div>

            <div className="bg-gray-700 rounded-xl p-4 sm:p-6 shadow">
              <h3 className="text-lg sm:text-xl font-semibold mb-3">Current focus</h3>
              <ul className="text-sm sm:text-base text-gray-300 space-y-2">
                <li>• Data pipeline patterns (batch + orchestration)</li>
                <li>• Data modeling + analytics layer design</li>
                <li>• Lakehouse & warehouse best practices</li>
                <li>• Building production-ready project READMEs and documentation</li>
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </SectionShell>

      {/* ---------- WHAT I BRING ---------- */}
      <SectionShell id="strengths" title="What I Bring" subtitle="A short summary">
        <motion.div className="grid lg:grid-cols-2 gap-6" initial="hidden" whileInView="show" variants={containerStagger} viewport={{ once: true }}>
          <motion.div variants={cardFade("up", 0.05)} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow">
            <h3 className="text-xl font-bold text-blue-300 flex items-center gap-2">
              <CheckCircle2 size={20} className="text-blue-300" />
              Core strengths
            </h3>
            <ul className="mt-4 space-y-3 text-gray-300">
              {WHAT_I_BRING.map((x) => (
                <li key={x} className="flex gap-3">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={cardFade("up", 0.12)} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow">
            <h3 className="text-xl font-bold text-blue-300 flex items-center gap-2">
              <Briefcase size={20} className="text-blue-300" />
              Roles I’m targeting
            </h3>

            <div className="mt-4 flex flex-wrap gap-2">
              {["Data Engineer", "Data Architect", "DataOps Engineer", "MLOps Engineer"].map((r) => (
                <span key={r} className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm border border-gray-600">
                  {r}
                </span>
              ))}
            </div>

            <div className="mt-6 bg-gray-700/60 border border-gray-600 rounded-xl p-4">
              <div className="text-sm text-gray-200 font-semibold">Quick note</div>
              <p className="mt-1 text-sm text-gray-300">
                I’m especially strong in pipeline construction and curated dataset design — and I’m building more production-style
                docs/diagrams to match real teams.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </SectionShell>

      {/* ---------- SKILLS ---------- */}
      <SectionShell
        id="skills"
        title="Skills & Technologies"
        subtitle="A snapshot of tools and strengths aligned to data engineering job descriptions."
      >
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10"
          initial="hidden"
          whileInView="show"
          variants={containerStagger}
          viewport={{ once: true }}
        >
          {SKILLS.map((skill, idx) => (
            <motion.div
              key={skill.name}
              variants={cardFade("up", idx * 0.05)}
              className="bg-gray-800 rounded-2xl p-4 sm:p-6 shadow hover:shadow-2xl transition transform hover:-translate-y-1 border border-gray-700"
              tabIndex={0}
              role="article"
              aria-label={`${skill.name} skill card`}
            >
              <div className="flex items-start justify-between mb-4 gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base sm:text-lg mb-1 truncate">{skill.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-400">{skill.description}</p>
                </div>

                <span
                  className={`flex-shrink-0 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                    skill.proficiency === "Advanced" ? "bg-green-600 text-white" : "bg-blue-600 text-white"
                  }`}
                >
                  {skill.proficiency}
                </span>
              </div>

              <div className="flex gap-1.5 sm:gap-2 mb-3" aria-hidden>
                {[...Array(5)].map((_, dotIndex) => (
                  <motion.div
                    key={dotIndex}
                    initial={{ scale: 0.8, opacity: 0.2 }}
                    whileInView={{
                      scale: dotIndex < skill.dots ? 1 : 0.9,
                      opacity: dotIndex < skill.dots ? 1 : 0.25,
                    }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: dotIndex * 0.04 }}
                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${
                      dotIndex < skill.dots ? skill.colorClass : "bg-gray-600"
                    }`}
                  />
                ))}
              </div>

              <div className="text-xs text-gray-400 mb-1">Confidence: {skill.percent}%</div>
              <div className="w-full bg-gray-700 rounded-full h-2.5 sm:h-3 overflow-hidden">
                <motion.div
                  className={`${skill.colorClass} h-full rounded-full`}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.percent}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" initial="hidden" whileInView="show" variants={containerStagger} viewport={{ once: true }}>
          <motion.div variants={cardFade("up", 0.05)} className="bg-gray-800 rounded-xl p-6 text-center shadow border border-gray-700">
            <Cloud className="text-blue-400 mx-auto mb-4" size={36} />
            <h3 className="text-xl font-bold mb-2">Cloud</h3>
            <p className="text-gray-300 mb-4">Microsoft Azure, AWS</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {["ADF", "ADLS Gen2", "Azure Blob", "IAM basics"].map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </div>
          </motion.div>

          <motion.div variants={cardFade("up", 0.12)} className="bg-gray-800 rounded-xl p-6 text-center shadow border border-gray-700">
            <Database className="text-purple-400 mx-auto mb-4" size={36} />
            <h3 className="text-xl font-bold mb-2">Data Engineering</h3>
            <p className="text-gray-300 mb-4">ETL/ELT, Modeling, Lakehouse patterns</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {["PySpark", "Databricks", "Delta", "Parquet"].map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </div>
          </motion.div>

          <motion.div variants={cardFade("up", 0.18)} className="bg-gray-800 rounded-xl p-6 text-center shadow border border-gray-700 sm:col-span-2 lg:col-span-1">
            <Briefcase className="text-green-400 mx-auto mb-4" size={36} />
            <h3 className="text-xl font-bold mb-2">Programming</h3>
            <p className="text-gray-300 mb-4">Python, SQL, Java, Git</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {["Python", "SQL", "Java", "Git"].map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </SectionShell>

      {/* ---------- PROJECTS ---------- */}
      <SectionShell
        id="projects"
        title="Project Case Studies"
        subtitle="A selection of projects showcasing end-to-end pipelines, data quality, and analytics-ready transformations."
        bg="bg-gray-800"
      >
        <motion.div className="space-y-6 sm:space-y-8" initial="hidden" whileInView="show" variants={containerStagger} viewport={{ once: true }}>
          {PROJECTS.map((p, i) => (
            <motion.article
              key={p.title}
              variants={cardFade("up", i * 0.08)}
              className="bg-gray-700 rounded-2xl p-5 sm:p-7 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 border border-gray-600"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-xl sm:text-2xl font-bold text-blue-200">{p.title}</h3>
                  <div className="mt-2 flex flex-wrap gap-2 items-center">
                    <span className="inline-flex items-center gap-2 text-sm text-blue-300 font-semibold">
                      <Calendar size={16} /> {p.duration}
                    </span>
                    <span className="inline-flex items-center gap-2 text-sm text-gray-300">
                      <Users size={16} /> {p.client}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <a
                    href={p.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center gap-2"
                  >
                    GitHub <ArrowUpRight size={16} />
                  </a>
                </div>
              </div>

              <div className="mt-5 grid lg:grid-cols-2 gap-5">
                <div className="space-y-4">
                  <div className="bg-gray-800/60 border border-gray-600 rounded-xl p-4">
                    <div className="text-sm font-semibold text-white mb-1">Problem</div>
                    <p className="text-sm sm:text-base text-gray-300">{p.problem}</p>
                  </div>

                  <div className="bg-gray-800/60 border border-gray-600 rounded-xl p-4">
                    <div className="text-sm font-semibold text-white mb-1">Objective</div>
                    <p className="text-sm sm:text-base text-gray-300">{p.objective}</p>
                  </div>

                  <ArchitectureBlock steps={p.architecture} />
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-800/60 border border-gray-600 rounded-xl p-4">
                    <div className="text-sm font-semibold text-white mb-2">What I built</div>
                    <ul className="space-y-2 text-gray-300">
                      {p.approach.map((x) => (
                        <li key={x} className="flex gap-3">
                          <span className="mt-2 w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                          <span className="text-sm sm:text-base">{x}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gray-800/60 border border-gray-600 rounded-xl p-4">
                    <div className="text-sm font-semibold text-white mb-2">Impact</div>
                    <ul className="space-y-2 text-gray-300">
                      {p.impact.map((x) => (
                        <li key={x} className="flex gap-3">
                          <CheckCircle2 size={18} className="text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm sm:text-base">{x}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-white mb-2">Tech stack</div>
                    <div className="flex flex-wrap gap-2">
                      {p.tech.map((t) => (
                        <Badge key={t}>{t}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </SectionShell>

      {/* ---------- CERTIFICATIONS ---------- */}
      <SectionShell id="certifications" title="Certifications" subtitle={null}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto">
          <a
            href="https://credentials.databricks.com/80290364-9760-4912-80bb-628ecb05f2d6#acc.1QyUwPgn"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800 p-5 rounded-2xl hover:bg-gray-700 transition-colors shadow-md border border-gray-700"
          >
            <div className="flex items-center space-x-4">
              <Award size={26} className="text-red-400 flex-shrink-0" />
              <div className="min-w-0">
                <h3 className="text-lg font-semibold truncate">Databricks Certified</h3>
                <p className="text-gray-400">Data Engineer Associate</p>
              </div>
            </div>
          </a>

          <a
            href="https://www.credly.com/badges/a97174d7-ca41-4aa8-afe9-0163699dcb66/public_url"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800 p-5 rounded-2xl hover:bg-gray-700 transition-colors shadow-md border border-gray-700"
          >
            <div className="flex items-center space-x-4">
              <Award size={26} className="text-yellow-400 flex-shrink-0" />
              <div className="min-w-0">
                <h3 className="text-lg font-semibold truncate">AWS Academy Graduate</h3>
                <p className="text-gray-400">Cloud Foundations</p>
              </div>
            </div>
          </a>

          <a
            href="https://www.hackerrank.com/certificates/731721820af3"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800 p-5 rounded-2xl hover:bg-gray-700 transition-colors shadow-md border border-gray-700"
          >
            <div className="flex items-center space-x-4">
              <Award size={26} className="text-purple-400 flex-shrink-0" />
              <div className="min-w-0">
                <h3 className="text-lg font-semibold truncate">HackerRank SQL</h3>
                <p className="text-gray-400">Advanced</p>
              </div>
            </div>
          </a>

          <a
            href="https://www.hackerrank.com/certificates/6f58d3da3e47"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800 p-5 rounded-2xl hover:bg-gray-700 transition-colors shadow-md border border-gray-700"
          >
            <div className="flex items-center space-x-4">
              <Award size={26} className="text-purple-400 flex-shrink-0" />
              <div className="min-w-0">
                <h3 className="text-lg font-semibold truncate">HackerRank SQL</h3>
                <p className="text-gray-400">Intermediate</p>
              </div>
            </div>
          </a>
        </div>
      </SectionShell>

      {/* ---------- CONTACT ---------- */}
      <SectionShell
        id="contact"
        title="Let’s Connect"
        subtitle="If you’re hiring for data engineering and similar roles, I’d love to chat."
        bg="bg-gray-800"
      >
        <motion.div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-start" initial="hidden" whileInView="show" variants={containerStagger} viewport={{ once: true }}>
          <motion.div variants={cardFade("up", 0.06)} className="bg-gray-800 rounded-xl p-6 sm:p-8 shadow border border-gray-700 order-2 md:order-1">
            <p className="text-gray-300 mb-6">
              I’m actively seeking opportunities in data engineering roles where I can apply my cloud-native skills and keep growing with modern data stacks.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
                <Mail className="text-blue-400 flex-shrink-0" size={18} />
                <span className="select-all break-all">parthsingh1253@gmail.com</span>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
                <Phone className="text-green-400 flex-shrink-0" size={18} />
                <span className="select-all">+91 8527713603</span>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
                <MapPin className="text-red-400 flex-shrink-0" size={18} />
                <span>Gurugram, Haryana, India</span>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
                <Github className="text-gray-300 flex-shrink-0" size={18} />
                <a href="https://github.com/parthhhhh12" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 break-all">
                  GitHub Profile
                </a>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
                <Linkedin className="text-blue-500 flex-shrink-0" size={18} />
                <a href="https://www.linkedin.com/in/singh05e/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 break-all">
                  LinkedIn Profile
                </a>
              </div>
            </div>
          </motion.div>

          <motion.form
            action="https://formspree.io/f/xgvnlvkd"
            method="POST"
            variants={cardFade("up", 0.12)}
            className="bg-gray-700 rounded-xl p-6 sm:p-8 shadow-lg space-y-5 border border-gray-600 order-1 md:order-2"
          >
            <div>
              <label htmlFor="name" className="block text-gray-200 font-semibold mb-2">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                required
                className="w-full p-3 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Your Name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-200 font-semibold mb-2">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                required
                className="w-full p-3 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-gray-200 font-semibold mb-2">Message</label>
              <textarea
                name="message"
                id="message"
                rows={5}
                required
                className="w-full p-3 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Write your message here..."
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
            >
              Send Message
            </motion.button>

            <p className="text-xs text-gray-300">
              Tip: If you’re a recruiter, feel free to mention the role name in your message — I’ll respond faster.
            </p>
          </motion.form>
        </motion.div>
      </SectionShell>

      {/* ---------- FOOTER ---------- */}
      <footer className="py-8 bg-gray-900 border-t border-gray-700">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">© 2026 Parth.</p>
        </div>
      </footer>
    </div>
  );
}

/* ============================
   Mobile Menu
   ============================ */
function MobileMenu({ onNavigate, activeSection, dark, setDark }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const navItems = [
    { id: "home", label: "home" },
    { id: "about", label: "about" },
    { id: "strengths", label: "what i bring" },
    { id: "skills", label: "skills" },
    { id: "projects", label: "projects" },
    { id: "certifications", label: "certifications" },
    { id: "contact", label: "contact" },
  ];

  const handleNavClick = (section) => {
    onNavigate(section);
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="p-2.5 rounded-md bg-gray-800 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-95 transition-all"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <AnimatePresence mode="wait">
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-gray-900/95 z-[998]"
              onClick={() => setOpen(false)}
            />

            <motion.aside
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-gradient-to-b from-gray-900 via-gray-900/95 to-gray-800 overflow-y-auto z-[999] flex flex-col"
              role="dialog"
              aria-modal="true"
            >
              <div className="flex items-center justify-between pt-4 pb-6 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center shadow">
                    <Database className="text-white" size={16} />
                  </div>
                  <span className="text-white font-semibold text-xl">Parth</span>
                </div>

                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="p-2 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors active:scale-95"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col flex-grow px-4">
                <nav className="flex flex-col gap-4 my-auto" aria-label="Mobile site navigation">
                  {navItems.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleNavClick(s.id)}
                      className={`text-left py-4 px-6 rounded-xl transition-all font-medium text-lg ${
                        activeSection === s.id ? "bg-blue-600 text-white shadow-lg" : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      <span className="capitalize">{s.label}</span>
                    </button>
                  ))}
                </nav>

                <div className="flex flex-col items-center text-center mt-10 px-4 pb-10">
                  <img
                    src="/img.jpeg"
                    alt="Parth"
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-600 shadow-xl"
                  />

                  <h3 className="mt-4 text-2xl font-extrabold">Parth</h3>

                  <label className="mt-3 inline-flex items-center gap-2 text-sm text-gray-300">
                    <input
                      type="checkbox"
                      checked={dark}
                      onChange={() => setDark((d) => !d)}
                      className="w-4 h-4 rounded border-gray-500 bg-gray-700 focus:ring-2 focus:ring-blue-400"
                    />
                    <span>Dark mode</span>
                  </label>

                  <p className="mt-2 text-blue-300 font-medium">Data Engineer • Azure • Databricks</p>
                  <p className="mt-3 text-sm text-gray-300 max-w-[92%]">
                    Building scalable pipelines and analytics-ready datasets using modern cloud-native tools.
                  </p>

                  <div className="mt-6 w-full flex flex-col gap-3">
                    <button
                      onClick={() => handleNavClick("projects")}
                      className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition"
                    >
                      <Briefcase size={18} />
                      View Case Studies
                    </button>

                    <a
                      href="/My_Data_Engineering_Resume-4.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full border border-gray-600 px-6 py-3 rounded-lg font-semibold inline-flex items-center justify-center gap-2 hover:border-white text-gray-200"
                    >
                      View Resume <ArrowUpRight size={16} />
                    </a>
                  </div>

                  <div className="mt-8 border-t border-gray-700 pt-6 text-center text-sm text-gray-500 w-full">
                    <p className="font-semibold text-gray-300">Parth</p>
                    <p className="mt-1">© 2026 All rights reserved</p>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}