"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";
import IssMap from "./components/IssMap";

const projects = [
  {
    title: "Interactive Survival Game",
    description:
      "Browser-based survival prototype focused on resources, player states and experimental gameplay systems.",
    link: "https://6a099b4dde7fd81f852fd866--spiffy-choux-827a9a.netlify.app/",
    button: "Play Demo",
    image: "/images/game.png",
    status: "Prototype",
  },
  {
    title: "The Static Frames",
    description:
      "AI-assisted indie rock project exploring songwriting, branding and digital music production.",
    link: "https://open.spotify.com/artist/75KarhA4wRynXeYROkwD9E",
    button: "Open Spotify",
    image: "/images/band-spotify.png",
    status: "Live",
  },
  {
    title: "Leasing Automation Concepts",
    description:
      "Workflow automation concepts for leasing systems, provider portals and process optimization.",
    link: "#",
    button: "In Progress",
    image: "/images/leasing.png",
    status: "In Progress",
  },
];

const workflowSteps = [
  {
    title: "Idea",
    description:
      "A problem, concept or rough opportunity becomes the starting point.",
  },
  {
    title: "Workflow Analysis",
    description:
      "I break down the process, identify friction points and define what should be improved.",
  },
  {
    title: "AI-assisted Prototyping",
    description:
      "I use tools like Codex, Claude and ChatGPT to move quickly from concept to interface, logic or prototype.",
  },
  {
    title: "Rapid Iteration",
    description:
      "I test, adjust and refine the result instead of waiting for a perfect first version.",
  },
  {
    title: "Deployment",
    description:
      "I ship the prototype using modern tools like GitHub and Vercel.",
  },
  {
    title: "Refinement",
    description:
      "I improve the result based on feedback, usage and new ideas.",
  },
];

export default function Home() {
  const [pointer, setPointer] = useState({ x: 50, y: 10 });
  const rafRef = useRef<number | null>(null);
  const mainRef = useRef<HTMLElement | null>(null);

  return (
    <main
      ref={mainRef}
      onMouseMove={(event) => {
        if (rafRef.current !== null) return;
        const rect = mainRef.current?.getBoundingClientRect();
        if (!rect || rect.width === 0 || rect.height === 0) return;
        const clientX = event.clientX;
        const clientY = event.clientY;
        rafRef.current = window.requestAnimationFrame(() => {
          const relativeX = clientX - rect.left;
          const relativeY = clientY - rect.top;
          const x = Math.max(0, Math.min(100, (relativeX / rect.width) * 100));
          const y = Math.max(0, Math.min(100, (relativeY / rect.height) * 100));
          setPointer({ x, y });
          rafRef.current = null;
        });
      }}
      className="relative min-h-screen overflow-hidden bg-[#05070b] text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(20,75,255,0.2),transparent_35%),radial-gradient(circle_at_85%_15%,rgba(56,189,248,0.15),transparent_35%),linear-gradient(to_bottom,#05070b,#070b13)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:42px_42px] [mask-image:radial-gradient(ellipse_at_top,black_55%,transparent_100%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background: `radial-gradient(460px circle at ${pointer.x}% ${pointer.y}%, rgba(59,130,246,0.16), transparent 60%)`,
        }}
      />

      <section className="relative z-10 border-b border-zinc-800/70">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-6">
          <h1 className="text-base font-semibold uppercase tracking-[0.28em] text-zinc-100 md:text-lg">
            CB Digital Lab
          </h1>

          <nav className="flex flex-wrap items-center gap-6 text-xs uppercase tracking-[0.22em] text-zinc-400 md:text-sm">
            <a href="#projects" className="transition-colors hover:text-white">
              Projects
            </a>

            <a href="#about" className="transition-colors hover:text-white">
              About
            </a>

            <a href="#contact" className="transition-colors hover:text-white">
              Contact
            </a>

            <a
              href="https://www.linkedin.com/in/christianblecke"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-white"
            >
              LinkedIn
            </a>

            <a
              href="https://github.com/Bleeecke"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-white"
            >
              GitHub
            </a>
          </nav>
        </div>
      </section>

      <section className="relative z-10 mx-auto flex min-h-[80vh] w-full max-w-7xl flex-col justify-center px-6 py-20 text-left">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mb-4 text-xs uppercase tracking-[0.34em] text-zinc-400 md:text-sm"
        >
          by Christian Blecke
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75 }}
          className="max-w-5xl text-4xl font-semibold leading-[1.05] tracking-tight text-zinc-100 sm:text-5xl lg:text-7xl"
        >
          Building AI-native systems and
          <br className="hidden md:block" />
          digital products with
          <br className="hidden md:block" />
          cinematic precision.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95 }}
          className="mt-8 max-w-2xl text-base leading-8 text-zinc-300 md:text-lg"
        >
          Combining workflow automation, experimental interfaces,
          and creative AI to move ideas from concept to product fast.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.05 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <a
            href="#projects"
            className="rounded-full border border-zinc-700 bg-zinc-900/70 px-6 py-3 text-sm font-medium text-zinc-100 transition-all hover:border-zinc-500 hover:bg-zinc-800"
          >
            View Projects
          </a>
          <a
            href="#about"
            className="rounded-full border border-zinc-800 px-6 py-3 text-sm font-medium text-zinc-300 transition-colors hover:text-white"
          >
            About Me
          </a>
        </motion.div>
      </section>

      <section className="relative z-10 border-y border-zinc-800/70 px-6 py-20 md:py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-zinc-800/80 bg-zinc-950/60 p-6 shadow-[0_0_90px_rgba(56,189,248,0.06)] backdrop-blur-xl md:p-8"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
              Workflow
            </p>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-100 md:text-4xl">
              How I move from idea to shipped result
            </h3>
            <p className="mt-5 max-w-3xl text-base leading-8 text-zinc-300 md:text-lg">
              I combine process thinking, AI-assisted development and fast
              iteration to turn ideas into visible, testable digital
              prototypes.
            </p>

            <div className="mt-10 grid gap-5 lg:grid-cols-6 lg:gap-0">
              {workflowSteps.map((step, index) => (
                <div key={step.title} className="relative lg:px-3">
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.12, duration: 0.45 }}
                    viewport={{ once: true }}
                    className="relative h-full rounded-2xl border border-zinc-800 bg-zinc-900/65 p-5"
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <span className="inline-flex h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.95)]" />
                      <span className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                        Step {index + 1}
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold text-zinc-100">
                      {step.title}
                    </h4>
                    <p className="mt-3 text-sm leading-7 text-zinc-300">
                      {step.description}
                    </p>
                  </motion.div>

                  {index < workflowSteps.length - 1 && (
                    <>
                      <span className="absolute -bottom-3 left-1/2 h-3 w-px -translate-x-1/2 bg-zinc-700/80 lg:hidden" />
                      <span className="absolute right-0 top-1/2 hidden h-px w-3 -translate-y-1/2 bg-zinc-700/80 lg:block" />
                    </>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

            <section className="relative z-10 border-t border-zinc-800/80 px-6 py-20 md:py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-zinc-800/90 bg-zinc-950/65 p-6 shadow-[0_0_85px_rgba(56,189,248,0.09)] backdrop-blur-xl md:p-8"
          >
            <p className="text-xs uppercase tracking-[0.34em] text-zinc-500 md:text-sm">
              Live Orbital Systems
            </p>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-100 md:text-4xl">
              Live Orbital Systems
            </h3>
            <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300 md:text-lg">
              Real-time orbital telemetry powered by public ISS data streams.
            </p>
            <p className="mt-4 max-w-4xl text-sm leading-7 text-zinc-400 md:text-base">
              This module demonstrates how I work: combining public data, AI-assisted development, and
              process-driven thinking to build reliable systems. The goal is not only visual output, but a
              robust data pipeline from source validation to live presentation.
            </p>
            <IssMap />
          </motion.div>
        </div>
      </section>

      <section
        id="projects"
        className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:py-28"
      >
        <div className="mb-14">
          <p className="text-xs uppercase tracking-[0.34em] text-zinc-500 md:text-sm">
            Projects
          </p>

          <h3 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-zinc-100 md:text-5xl">
            Selected products, experiments, and creative builds
          </h3>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.12 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              className="group rounded-3xl border border-zinc-800 bg-zinc-950/65 p-5 backdrop-blur-md transition-colors hover:border-zinc-600 md:p-6"
            >
              <div className="relative mb-6 h-52 overflow-hidden rounded-2xl">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full border border-zinc-600/70 bg-black/60 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-zinc-200">
                  {project.status}
                </span>
              </div>
              <h4 className="text-xl font-semibold text-zinc-100 md:text-2xl">
                {project.title}
              </h4>

              <p className="mt-3 text-sm leading-7 text-zinc-400 md:text-base">
                {project.description}
              </p>

              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="mt-7 inline-flex rounded-xl border border-zinc-700 px-5 py-3 text-sm font-medium text-zinc-200 transition-all hover:border-zinc-500 hover:bg-zinc-900"
              >
                {project.button}
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      <section
        id="about"
        className="relative z-10 border-t border-zinc-800/80 px-6 py-20 md:py-24"
      >
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[320px_1fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            viewport={{ once: true }}
            className="relative mx-auto h-[380px] w-full max-w-[320px] overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/70"
          >
            <Image
              src="/images/christian.jpg"
              alt="Portrait of Christian Blecke"
              fill
              sizes="(max-width: 1024px) 100vw, 320px"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
          </motion.div>

          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-zinc-500 md:text-sm">
              About
            </p>

            <h3 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-100 md:text-5xl">
              I build digital concepts where process meets creative AI.
            </h3>

            <p className="mt-8 text-base leading-8 text-zinc-300 md:text-lg">
              I work at the intersection of workflow automation, digital
              prototyping, and creative AI projects.
            </p>

            <p className="mt-5 text-base leading-8 text-zinc-300 md:text-lg">
              With a background in team leadership and operational processes in
              the bicycle leasing industry, I focus on understanding complex
              workflows, identifying friction points, and turning ideas into
              visible, testable concepts.
            </p>

            <p className="mt-5 text-base leading-8 text-zinc-300 md:text-lg">
              I do not position myself as a classical software developer. I
              combine AI-assisted development, process thinking, and
              experimentation to quickly build interfaces, workflows, and
              digital concepts that can be tested and improved.
            </p>

            <p className="mt-5 text-base leading-8 text-zinc-300 md:text-lg">
              My projects range from leasing automation concepts and
              browser-based games to AI-supported music production and modern
              web experiences.
            </p>

            <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6">
              <p className="text-xs uppercase tracking-[0.28em] text-zinc-400">
                Currently focused on
              </p>
              <ul className="mt-4 grid gap-2 text-sm text-zinc-200 md:grid-cols-2 md:text-base">
                <li>AI-assisted workflow design</li>
                <li>Process automation</li>
                <li>Digital product prototyping</li>
                <li>Interactive systems</li>
                <li>Creative AI projects</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 border-t border-zinc-800/80 px-6 py-20 md:py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-6 shadow-[0_0_80px_rgba(56,189,248,0.08)] md:p-8"
          >
            <p className="text-xs uppercase tracking-[0.34em] text-zinc-500 md:text-sm">
              Creative AI & Music
            </p>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-100 md:text-4xl">
              The Static Frames
            </h3>
            <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300 md:text-lg">
              The Static Frames is my AI-assisted indie rock project, combining
              songwriting, digital production, and creative experimentation.
            </p>

            <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-800/90 bg-black/30">
              <iframe
                src="https://open.spotify.com/embed/track/0Kcuf7JLHw3wIKQQolSxkl?utm_source=generator"
                width="100%"
                height="352"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title="Spotify player for The Static Frames"
                className="block w-full"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section
        id="contact"
        className="relative z-10 border-t border-zinc-800/80 px-6 py-16 md:py-20"
      >
        <div className="mx-auto max-w-7xl rounded-3xl border border-zinc-800 bg-zinc-950/55 p-8 md:p-10">
          <p className="text-xs uppercase tracking-[0.34em] text-zinc-500 md:text-sm">
            Contact
          </p>
          <h3 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-100 md:text-4xl">
            Connect with me
          </h3>
          <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-300 md:text-lg">
            If you want to discuss workflow optimization, AI-assisted product
            concepts, or creative digital experiments, feel free to reach out.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="https://www.linkedin.com/in/christianblecke"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-zinc-700 bg-zinc-900/70 px-6 py-3 text-sm font-medium text-zinc-100 transition-all hover:border-zinc-500 hover:bg-zinc-800"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/Bleeecke"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-200 transition-all hover:border-zinc-500 hover:bg-zinc-900"
            >
              GitHub
            </a>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-zinc-800/80 px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 text-sm text-zinc-400">
          <p>© {new Date().getFullYear()} CB Digital Lab</p>
          <div className="flex items-center gap-5">
            <a
              href="https://www.linkedin.com/in/christianblecke"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-white"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/Bleeecke"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-white"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

