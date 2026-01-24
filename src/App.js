// src/App.jsx
import React, { useEffect, useState, useRef } from "react";
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * FULL PORTFOLIO APP (Animated + Accessible + Mobile Responsive)
 *
 * - Keep this in one file for quick copy-paste into VS Code.
 * - Ensure Tailwind + Framer Motion + lucide-react are installed.
 *
 * Notes:
 * - Replace /img.jpeg and resume path if required.
 * - Tune animation durations in the variants below if desired.
 */

/* ============================
   Animation Variants & Helpers
   ============================ */

const containerStagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.12,
    },
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
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 12,
      mass: 0.5,
      delay,
    },
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
   Static Data (updated)
   ============================ */

const SKILLS = [
  {
    name: "Python",
    proficiency: "Advanced",
    description: "2+ years experience",
    colorClass: "bg-blue-500",
    dots: 5,
    percent: 92,
  },
  {
    name: "PySpark",
    proficiency: "Intermediate",
    description: "1+ years experience",
    colorClass: "bg-orange-500",
    dots: 4,
    percent: 78,
  },
  {
    name: "Microsoft Azure",
    proficiency: "Intermediate",
    description: "2+ years experience",
    colorClass: "bg-cyan-500",
    dots: 4,
    percent: 74,
  },
  {
    name: "Databricks",
    proficiency: "Intermediate",
    description: "1+ years experience",
    colorClass: "bg-red-500",
    dots: 4,
    percent: 75,
  },
  {
    name: "SQL",
    proficiency: "Advanced",
    description: "2+ years experience",
    colorClass: "bg-green-500",
    dots: 5,
    percent: 90,
  },
  {
    name: "Snowflake",
    proficiency: "Intermediate",
    description: "1+ years experience",
    colorClass: "bg-purple-500",
    dots: 4,
    percent: 72,
  },
  {
    name: "Dbt",
    proficiency: "Intermediate",
    description: "1+ years experience",
    colorClass: "bg-purple-500",
    dots: 4,
    percent: 72,
  },
  {
    name: "Delta Lake",
    proficiency: "Intermediate",
    description: "ACID transactions implementation",
    colorClass: "bg-purple-500",
    dots: 4,
    percent: 72,
  },
  {
    name: "Java",
    proficiency: "Intermediate",
    description: "Object-oriented programming",
    colorClass: "bg-pink-500",
    dots: 3,
    percent: 60,
  },
];

const PROJECTS = [
  {
    title: "Batch ETL Pipeline using PySpark on Azure Databricks",
    duration: "Self-Project",
    client: "Personal Development",
    description:
      "Built and deployed a batch ETL pipeline on Azure Databricks to process raw NYC Taxi Trip data, clean and transform it, and store the results in Parquet format on Azure Blob Storage for analytics and reporting.",
    tech: [
      "Azure Databricks",
      "PySpark",
      "Azure Blob Storage",
      "Parquet",
      "DBML",
    ],
    highlights: [
      "Implemented an end-to-end ETL pipeline with ingestion, transformation, and aggregation",
      "Ingested raw NYC Taxi Trip dataset (10M+ rows) from Azure Blob Storage",
      "Performed data cleaning, filtering, and type casting using PySpark DataFrame APIs",
      "Aggregated daily ride counts per vendor for business insights",
      "Stored transformed datasets in Parquet format for efficient querying and BI integration",
      "Designed a logical ER diagram (Raw → Cleaned → Aggregated tables) using DBML",
    ],
    businessObjective:
      "To build a scalable and efficient batch ETL pipeline for processing large-scale taxi trip data, ensuring clean, analytics-ready datasets that support reporting and decision-making.",
    projectLink:
      "https://github.com/parthhhhh12/Data_Engineering_Personal_Project",
  },
  {
    title: "NYC Taxi Data Pipeline using Azure Data Factory & Databricks",
    duration: "Self-Project",
    client: "Personal Development",
    description:
      "Designed and implemented an end-to-end data engineering pipeline for processing the NYC Taxi dataset using Azure Data Factory (ADF), Databricks, and Azure Data Lake Storage (ADLS).",
    tech: [
      "Azure Data Factory",
      "Azure Databricks",
      "Azure Data Lake Storage Gen2",
      "Mapping Data Flows",
      "Parquet",
    ],
    highlights: [
      "Automated ingestion of raw trip records into ADLS using parameterized ADF pipelines",
      "Applied filtering, aggregation, and schema enforcement via ADF Mapping Data Flows",
      "Stored curated datasets in Parquet format for scalability and performance",
      "Analyzed processed data in Databricks notebooks to derive vendor performance and payment insights",
      "Generated insights: Vendor 2 handled ~60% rides, credit card payments contributed ~70% revenue",
      "Implemented weekly scheduled triggers for automated execution",
    ],
    businessObjective:
      "To automate ingestion, transformation, and analysis of large-scale NYC Taxi trip data, ensuring reliable, analytics-ready datasets for BI tools.",
    projectLink: "https://github.com/parthhhhh12/ADF_Pipeline_Data_Project",
  },
];

/* ============================
   Small Utility Components
   ============================ */

const IconButton = ({ children, href, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="bg-gray-800 p-3 rounded-full hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
  >
    {children}
  </a>
);

/* ============================
   Main App
   ============================ */

export default function App() {
  // Active nav item (scroll spy)
  const [activeSection, setActiveSection] = useState("home");

  // Scrolled flag for nav background
  const [isScrolled, setIsScrolled] = useState(false);

  // Dark mode toggle
  const [dark, setDark] = useState(true);

  // Refs for sections for keyboard navigation and intersection observer
  const sectionIds = ["home", "about", "skills", "projects", "certifications", "contact"];
  const sectionRefs = useRef({});

  // Set up intersection observer for scroll spy
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);

    const observer = new IntersectionObserver(
      (entries) => {
        // find the most visible entry
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
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
  }, []);

  // Smooth scroll
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(id);
  };

  // Toggle theme class on html/body for Tailwind (class-based dark)
  useEffect(() => {
    const html = document.documentElement;
    if (dark) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [dark]);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${dark ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      {/* ---------- NAVIGATION ---------- */}
      <motion.nav
        variants={navFade}
        initial="hidden"
        animate="show"
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-sm transition-all duration-300 ${isScrolled ? (dark ? "bg-gray-900/80" : "bg-white/60 shadow-md") : "bg-transparent"}`}
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
              {["home", "about", "skills", "projects", "certifications", "contact"].map((s) => (
                <button
                  key={s}
                  onClick={() => scrollTo(s)}
                  className={`capitalize px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors ${activeSection === s ? "text-blue-400 font-semibold" : "text-gray-300 hover:text-blue-400"}`}
                >
                  {s}
                </button>
              ))}

              {/* Theme Toggle */}
              <button
                onClick={() => setDark((d) => !d)}
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="Toggle theme"
              >
                {dark ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>

            {/* Mobile nav (simple) */}
            <div className="md:hidden">
              <MobileMenu onNavigate={scrollTo} activeSection={activeSection} dark={dark} setDark={setDark} />
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ---------- HERO ---------- */}
      <section id="home" className="min-h-screen flex items-center justify-center relative pt-20 px-4">
        <motion.div
          className="max-w-4xl text-center w-full"
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
            className="mt-2 text-lg sm:text-xl md:text-2xl text-blue-300 px-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            Associate Data Engineer
          </motion.h2>

          <motion.p className="mt-4 text-sm sm:text-base text-gray-300 max-w-2xl mx-auto px-4">
            Specialized in Azure | Databricks | Python | SQL | PySpark. Building
            scalable data pipelines and analytics-ready datasets.
          </motion.p>

          <motion.div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
            <button
              onClick={() => scrollTo("projects")}
              className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-transform transform hover:-translate-y-0.5 shadow-lg"
              aria-label="View projects"
            >
              <Briefcase size={18} />
              View My Work
            </button>

            <a
              href="/My_Data_Engineering_Resume-4.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto border border-gray-400 px-6 py-3 rounded-lg font-semibold inline-flex items-center justify-center gap-2 hover:border-white"
            >
              View Resume
            </a>
          </motion.div>
        </motion.div>

        <motion.div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden sm:block" {...floatY}>
          <ChevronDown size={28} className="text-gray-400" />
        </motion.div>
      </section>

      {/* ---------- ABOUT ---------- */}
      <section id="about" className="py-12 sm:py-20 bg-gray-800 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 text-blue-300" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            About Me
          </motion.h2>

          <motion.div className="grid md:grid-cols-2 gap-6 sm:gap-8" initial="hidden" whileInView="show" variants={containerStagger} viewport={{ once: true }}>
            <motion.div variants={cardFade("up", 0.05)} className="space-y-4 sm:space-y-6">
              <div className="bg-gray-700 rounded-xl p-4 sm:p-6 shadow">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 flex items-center gap-3">
                  <Target className="text-blue-400 flex-shrink-0" size={20} />
                  Professional Summary
                </h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                Data Engineer with strong hands-on experience in designing, building, and optimizing scalable data pipelines using PySpark, Databricks, Microsoft Azure, Snowflake, and dbt. Experienced in implementing end-to-end ETL/ELT workflows, transforming raw data into analytics-ready datasets, and working with cloud-based data warehouses.
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
                <h3 className="text-lg sm:text-xl font-semibold mb-3">Key Strengths</h3>
                <ul className="text-sm sm:text-base text-gray-300 space-y-2">
                  <li>• Cloud-native data engineering solutions</li>
                  <li>• ETL/ELT pipeline development</li>
                  <li>• Big data processing with PySpark</li>
                  <li>• Azure ecosystem expertise</li>
                  <li>• Delta Lake implementation</li>
                </ul>
              </div>

              <div className="bg-gray-700 rounded-xl p-4 sm:p-6 shadow">
                <h3 className="text-lg sm:text-xl font-semibold mb-3">What I enjoy</h3>
                <p className="text-sm sm:text-base text-gray-300">
                  Problem solving, building reliable data systems, and turning messy data into business insights. I enjoy collaborating with cross-functional teams and learning new tools in the data stack.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ---------- SKILLS ---------- */}
      <section id="skills" className="py-12 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 text-blue-300" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Skills & Technologies
          </motion.h2>

          <motion.div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12" initial="hidden" whileInView="show" variants={containerStagger} viewport={{ once: true }}>
            {SKILLS.map((skill, idx) => (
              <motion.div
                key={skill.name}
                variants={cardFade("up", idx * 0.05)}
                className="bg-gray-800 rounded-2xl p-4 sm:p-6 shadow hover:shadow-2xl transition transform hover:-translate-y-1"
                tabIndex={0}
                role="article"
                aria-label={`${skill.name} skill card`}
              >
                <div className="flex items-start justify-between mb-4 gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base sm:text-lg mb-1 truncate">{skill.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-400">{skill.description}</p>
                  </div>

                  <span className={`flex-shrink-0 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${skill.proficiency === "Advanced" ? "bg-green-600 text-white" : "bg-blue-600 text-white"}`}>
                    {skill.proficiency}
                  </span>
                </div>

                {/* Animated Proficiency Dots */}
                <div className="flex gap-1.5 sm:gap-2 mb-3" aria-hidden>
                  {[...Array(5)].map((_, dotIndex) => (
                    <motion.div
                      key={dotIndex}
                      initial={{ scale: 0.8, opacity: 0.2 }}
                      whileInView={{ scale: dotIndex < skill.dots ? 1 : 0.9, opacity: dotIndex < skill.dots ? 1 : 0.25 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: dotIndex * 0.04 }}
                      className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${dotIndex < skill.dots ? skill.colorClass : "bg-gray-600"}`}
                    />
                  ))}
                </div>

                {/* Progress bar */}
                <div className="text-xs text-gray-400 mb-1">Proficiency: {skill.percent}%</div>
                <div className="w-full bg-gray-700 rounded-full h-2.5 sm:h-3 overflow-hidden">
                  <motion.div className={`${skill.colorClass} h-full rounded-full`} initial={{ width: 0 }} whileInView={{ width: `${skill.percent}%` }} transition={{ duration: 0.8 }} />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Technology categories */}
          <motion.div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8" initial="hidden" whileInView="show" variants={containerStagger} viewport={{ once: true }}>
            <motion.div variants={cardFade("up", 0.05)} className="bg-gray-800 rounded-xl p-4 sm:p-6 text-center shadow">
              <Cloud className="text-blue-400 mx-auto mb-3 sm:mb-4" size={36} />
              <h3 className="text-lg sm:text-xl font-bold mb-2">Cloud Platforms</h3>
              <p className="text-sm sm:text-base text-gray-300 mb-3 sm:mb-4">Microsoft Azure, AWS</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {["Azure Data Factory", "ADLS Gen2", "Azure Blob Storage", "AWS Academy"].map((t) => (
                  <span key={t} className="bg-blue-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div variants={cardFade("up", 0.12)} className="bg-gray-800 rounded-xl p-4 sm:p-6 text-center shadow">
              <Database className="text-purple-400 mx-auto mb-3 sm:mb-4" size={36} />
              <h3 className="text-lg sm:text-xl font-bold mb-2">Data Engineering</h3>
              <p className="text-sm sm:text-base text-gray-300 mb-3 sm:mb-4">ETL/ELT pipelines, Data Modeling</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {["PySpark", "Databricks", "Delta Lake", "Data Orchestration"].map((t) => (
                  <span key={t} className="bg-purple-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div variants={cardFade("up", 0.18)} className="bg-gray-800 rounded-xl p-4 sm:p-6 text-center shadow sm:col-span-2 lg:col-span-1">
              <Briefcase className="text-green-400 mx-auto mb-3 sm:mb-4" size={36} />
              <h3 className="text-lg sm:text-xl font-bold mb-2">Programming</h3>
              <p className="text-sm sm:text-base text-gray-300 mb-3 sm:mb-4">Python, SQL, Java</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {["Python", "SQL", "Java", "Git"].map((t) => (
                  <span key={t} className="bg-green-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ---------- PROJECTS ---------- */}
      <section id="projects" className="py-12 sm:py-20 bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 text-blue-300" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Recent Projects
          </motion.h2>

          <motion.div className="space-y-6 sm:space-y-8" initial="hidden" whileInView="show" variants={containerStagger} viewport={{ once: true }}>
            {PROJECTS.map((p, i) => (
              <motion.article key={i} variants={cardFade("up", i * 0.08)} className="bg-gray-700 rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
                <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
                  <div className="lg:col-span-1 space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="text-blue-400 flex-shrink-0" size={16} />
                      <span className="text-sm sm:text-base text-blue-400 font-semibold">{p.duration}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="text-green-400 flex-shrink-0" size={16} />
                      <span className="text-sm sm:text-base text-gray-300">{p.client}</span>
                    </div>

                    <div>
                      <h4 className="font-semibold text-white mb-2 text-sm sm:text-base">Technologies:</h4>
                      <div className="flex flex-wrap gap-2">
                        {p.tech.map((t) => (
                          <span key={t} className="bg-blue-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <h3 className="text-xl sm:text-2xl font-bold mb-3 text-blue-300">{p.title}</h3>
                    <p className="text-sm sm:text-base text-gray-300 mb-4 leading-relaxed">{p.description}</p>

                    <div className="mb-4">
                      <h4 className="text-sm sm:text-base text-white font-semibold mb-2">Business Objective:</h4>
                      <p className="text-sm sm:text-base text-gray-300 bg-gray-600 p-3 rounded italic">{p.businessObjective}</p>
                    </div>

                    <div className="space-y-2 sm:space-y-3 mb-4">
                      <h4 className="text-sm sm:text-base text-white font-semibold">Key Achievements:</h4>
                      {p.highlights.map((h, idx) => (
                        <div key={idx} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-600 rounded">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-1.5 sm:mt-2 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-gray-300">{h}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                      <a href={p.projectLink} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-center text-sm sm:text-base">
                        View Project on GitHub
                      </a>
                      <a href={p.projectLink} target="_blank" rel="noopener noreferrer" className="text-blue-300 underline text-sm sm:text-base">
                        Open Repo
                      </a>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---------- CERTIFICATIONS ---------- */}

      <section id="certifications" className="py-12 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-10 text-center text-blue-300">Certifications</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* AWS Academy Graduate */}
            <a
              href="https://www.credly.com/badges/a97174d7-ca41-4aa8-afe9-0163699dcb66/public_url"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 p-4 sm:p-5 rounded-2xl hover:bg-gray-700 transition-colors shadow-md"
            >
              <div className="flex items-center space-x-3 sm:space-x-4">
                <Award size={24} className="text-yellow-400 flex-shrink-0" />
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold truncate">AWS Academy Graduate</h3>
                  <p className="text-sm sm:text-base text-gray-400">Cloud Foundations</p>
                </div>
              </div>
            </a>

            {/* HackerRank SQL (Advance) */}
            <a
              href="https://www.hackerrank.com/certificates/731721820af3"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 p-4 sm:p-5 rounded-2xl hover:bg-gray-700 transition-colors shadow-md"
            >
              <div className="flex items-center space-x-3 sm:space-x-4">
                <Award size={24} className="text-purple-400 flex-shrink-0" />
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold truncate">HackerRank SQL</h3>
                  <p className="text-sm sm:text-base text-gray-400">Advance Certification</p>
                </div>
              </div>
            </a>

            {/* HackerRank SQL (Intermediate) */}
            <a
              href="https://www.hackerrank.com/certificates/6f58d3da3e47"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 p-4 sm:p-5 rounded-2xl hover:bg-gray-700 transition-colors shadow-md"
            >
              <div className="flex items-center space-x-3 sm:space-x-4">
                <Award size={24} className="text-purple-400 flex-shrink-0" />
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold truncate">HackerRank SQL</h3>
                  <p className="text-sm sm:text-base text-gray-400">Intermediate Certification</p>
                </div>
              </div>
            </a>

            {/* HackerRank SQL (Basic) */}
            <a
              href="https://www.hackerrank.com/certificates/f507e955aa98"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 p-4 sm:p-5 rounded-2xl hover:bg-gray-700 transition-colors shadow-md"
            >
              <div className="flex items-center space-x-3 sm:space-x-4">
                <Award size={24} className="text-blue-400 flex-shrink-0" />
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold truncate">HackerRank SQL</h3>
                  <p className="text-sm sm:text-base text-gray-400">Basic Certification</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ---------- CONTACT ---------- */}
      <section id="contact" className="py-12 sm:py-20 bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 text-blue-300"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Let's Connect
          </motion.h2>

          <motion.div
            className="grid md:grid-cols-2 gap-8 sm:gap-12 items-start"
            initial="hidden"
            whileInView="show"
            variants={containerStagger}
            viewport={{ once: true }}
          >
            {/* LEFT CONTACT DETAILS */}
            <motion.div
              variants={cardFade("up", 0.06)}
              className="bg-gray-800 rounded-xl p-4 sm:p-8 shadow order-2 md:order-1"
            >
              <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6">
                I'm actively seeking opportunities in data engineering roles where I
                can apply my cloud-native skills and continue growing in the field of
                big data and analytics.
              </p>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-700 rounded-lg">
                  <Mail className="text-blue-400 flex-shrink-0" size={18} />
                  <span className="select-all text-sm sm:text-base break-all">parthsingh1253@gmail.com</span>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-700 rounded-lg">
                  <Phone className="text-green-400 flex-shrink-0" size={18} />
                  <span className="select-all text-sm sm:text-base">+91 8527713603</span>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-700 rounded-lg">
                  <MapPin className="text-red-400 flex-shrink-0" size={18} />
                  <span className="text-sm sm:text-base">Gurugram, Haryana, India</span>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-700 rounded-lg">
                  <Github className="text-gray-300 flex-shrink-0" size={18} />
                  <a
                    href="https://github.com/parthhhhh12"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-400 text-sm sm:text-base break-all"
                  >
                    GitHub Profile
                  </a>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-700 rounded-lg">
                  <Linkedin className="text-blue-500 flex-shrink-0" size={18} />
                  <a
                    href="https://www.linkedin.com/in/singh05e/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-400 text-sm sm:text-base break-all"
                  >
                    LinkedIn Profile
                  </a>
                </div>
              </div>
            </motion.div>

            {/* RIGHT CONTACT FORM */}
            <motion.form
              action="https://formspree.io/f/xgvnlvkd"
              method="POST"
              variants={cardFade("up", 0.12)}
              className="bg-gray-700 rounded-xl p-4 sm:p-8 shadow-lg space-y-4 sm:space-y-6 order-1 md:order-2"
            >
              <div>
                <label htmlFor="name" className="block text-gray-300 font-semibold mb-2 text-sm sm:text-base">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className="w-full p-3 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm sm:text-base"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-300 font-semibold mb-2 text-sm sm:text-base">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className="w-full p-3 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm sm:text-base"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-gray-300 font-semibold mb-2 text-sm sm:text-base">
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows="5"
                  required
                  className="w-full p-3 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm sm:text-base"
                  placeholder="Write your message here..."
                ></textarea>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all text-sm sm:text-base"
              >
                Send Message
              </motion.button>
            </motion.form>
          </motion.div>
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer className="py-6 sm:py-8 bg-gray-900 border-t border-gray-700">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm sm:text-base text-gray-400">© 2025 Parth.</p>
        </div>
      </footer>
    </div>
  );
}

/* ============================
   Mobile Menu (helper component)
   - Slide-in modal for small screens (UPDATED to match provided screenshot)
   ============================ */
function MobileMenu({ onNavigate, activeSection, dark, setDark }) {
  const [open, setOpen] = useState(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const handleNavClick = (section) => {
    onNavigate(section);
    setOpen(false);
  };

  const navItems = [
    { id: "home", label: "home" },
    { id: "about", label: "about" },
    { id: "skills", label: "skills" },
    { id: "projects", label: "projects" },
    { id: "certifications", label: "certifications" },
    { id: "contact", label: "contact" },
  ];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="p-2.5 rounded-md bg-gray-800 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-95 transition-all z-50"
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
            {/* Full screen backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-gray-900 z-[998]"
              onClick={() => setOpen(false)}
              style={{ zIndex: 998 }}
            />

            {/* Full screen menu */}
            <motion.aside
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-gradient-to-b from-gray-900 via-gray-900/95 to-gray-800 overflow-y-auto z-[999] flex flex-col"
              role="dialog"
              aria-modal="true"
              style={{ zIndex: 999, minHeight: '100vh', maxHeight: '100vh' }}
            >
              {/* Header with close button */}
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
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              {/* Full screen navigation */}
              <div className="flex flex-col flex-grow px-4">
                {/* Nav list (centered) */}
                <nav className="flex flex-col gap-4 my-auto" aria-label="Mobile site navigation">
                  {navItems.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleNavClick(s.id)}
                      className={`text-left py-4 px-6 rounded-xl transition-all font-medium text-lg ${
                        activeSection === s.id
                          ? "bg-blue-600 text-white shadow-lg"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      <span className="capitalize">{s.label}</span>
                    </button>
                  ))}
                </nav>

                {/* Profile section at bottom */}
                <div className="flex flex-col items-center text-center mt-8 px-4 pb-8">
                  <div className="relative">
                    <img
                      src="/img.jpeg"
                      alt="Parth"
                      className="w-24 h-24 rounded-full object-cover border-4 border-blue-600 shadow-xl"
                    />
                  </div>

                  <h3 className="mt-4 text-2xl font-extrabold">Parth</h3>

                  <div className="mt-2 flex items-center gap-2">
                    <label className="inline-flex items-center gap-2 text-sm text-gray-300">
                      <input
                        type="checkbox"
                        checked={dark}
                        onChange={() => setDark((d) => !d)}
                        className="w-4 h-4 rounded border-gray-500 bg-gray-700 focus:ring-2 focus:ring-blue-400"
                        aria-label="Toggle dark mode"
                      />
                      <span>Dark mode</span>
                    </label>
                  </div>

                  <p className="mt-2 text-blue-300 font-medium">Associate Data Engineer</p>

                  <p className="mt-3 text-sm text-gray-300 max-w-[86%]">
                    Specialized in Azure | Databricks | Python | SQL | PySpark. Building scalable data pipelines and analytics-ready datasets.
                  </p>

                  <div className="mt-6 w-full flex flex-col sm:flex-row gap-3 justify-center px-4">
                    <button
                      onClick={() => {
                        onNavigate("projects");
                        setOpen(false);
                      }}
                      className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition"
                    >
                      <Briefcase size={18} />
                      View My Work
                    </button>

                    <a
                      href="/My_Data_Engineering_Resume-4.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto border border-gray-600 px-6 py-3 rounded-lg font-semibold inline-flex items-center justify-center gap-2 hover:border-white text-gray-200"
                    >
                      View Resume
                    </a>
                  </div>

                  {/* Contact info */}
                  <div className="mt-6 px-2 space-y-3 w-full max-w-md">
                    <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg">
                      <Mail className="text-blue-400 flex-shrink-0" size={20} />
                      <span className="text-gray-300">parthsingh1253@gmail.com</span>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg">
                      <Phone className="text-green-400 flex-shrink-0" size={20} />
                      <span className="text-gray-300">+91 8527713603</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-8 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
                    <p className="font-semibold text-gray-400">Parth</p>
                    <p className="mt-1">Associate Data Engineer</p>
                    <p className="mt-3">© 2025 All rights reserved</p>
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