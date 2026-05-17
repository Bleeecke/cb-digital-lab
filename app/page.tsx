"use client";

import { motion } from "framer-motion";
import Image from "next/image";

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

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(20,75,255,0.2),transparent_35%),radial-gradient(circle_at_85%_15%,rgba(56,189,248,0.15),transparent_35%),linear-gradient(to_bottom,#05070b,#070b13)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:42px_42px] [mask-image:radial-gradient(ellipse_at_top,black_55%,transparent_100%)]" />

      <section className="relative z-10 border-b border-zinc-800/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <h1 className="text-base font-semibold uppercase tracking-[0.28em] text-zinc-100 md:text-lg">
            CB Digital Lab
          </h1>

          <nav className="flex gap-6 text-xs uppercase tracking-[0.22em] text-zinc-400 md:text-sm">
            <a href="#projects" className="transition-colors hover:text-white">
              Projects
            </a>

            <a href="#about" className="transition-colors hover:text-white">
              About
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
        <div className="mx-auto max-w-4xl">
          <p className="text-xs uppercase tracking-[0.34em] text-zinc-500 md:text-sm">
            About
          </p>

          <h3 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-100 md:text-5xl">
            Process thinking meets creative AI.
          </h3>

          <p className="mt-8 text-base leading-8 text-zinc-300 md:text-lg">
            I work at the intersection of workflow automation,
            digital prototyping and creative technology.
            My focus is not traditional software engineering,
            but understanding systems, optimizing processes
            and rapidly building ideas into visible concepts.
          </p>
        </div>
      </section>
    </main>
  );
}
