"use client";

import { motion } from "framer-motion";
import Image from "next/image";



export default function Home() {
  const projects = [
  {
    title: "Interactive Survival Game",
    description:
      "Browser-based survival prototype focused on resources, player states and experimental gameplay systems.",
    link: "https://6a099b4dde7fd81f852fd866--spiffy-choux-827a9a.netlify.app/",
    button: "Play Demo",
    image: "/images/Game.png",
  },
  {
    title: "The Static Frames",
    description:
      "AI-assisted indie rock project exploring songwriting, branding and digital music production.",
    link: "https://open.spotify.com/artist/75KarhA4wRynXeYROkwD9E",
    button: "Open Spotify",
    image: "/images/BandSpotify.png",
  },
  {
    title: "Leasing Automation Concepts",
    description:
      "Workflow automation concepts for leasing systems, provider portals and process optimization.",
    link: "#",
    button: "In Progress",
    image: "/images/Leasing.png",
  },
];

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(80,80,255,0.18),transparent_40%)]" />

      <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />

      <section className="relative z-10 border-b border-zinc-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <h1 className="text-xl font-semibold tracking-wide">
            CB Digital Lab
          </h1>

          <nav className="flex gap-6 text-sm text-zinc-400">
            <a href="#projects" className="hover:text-white">
              Projects
            </a>

            <a href="#about" className="hover:text-white">
              About
            </a>
          </nav>
        </div>
      </section>

      <section className="relative z-10 flex min-h-[75vh] flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 text-sm uppercase tracking-[0.3em] text-zinc-500"
        >
          by Christian Blecke
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl text-5xl font-bold leading-tight md:text-7xl"
        >
          AI-assisted workflows,
          <br />
          digital prototypes
          <br />
          and creative projects.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mt-8 max-w-2xl text-lg text-zinc-400"
        >
          Combining process automation, interactive concepts,
          creative AI and modern digital experimentation.
        </motion.p>
      </section>

      <section
        id="projects"
        className="relative z-10 mx-auto max-w-7xl px-6 py-24"
      >
        <div className="mb-12">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
            Projects
          </p>

          <h3 className="mt-4 text-4xl font-bold">
            Selected Work
          </h3>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-8 backdrop-blur-sm"
            >
<div className="relative mb-6 h-48 overflow-hidden rounded-2xl">
  <Image
    src={project.image}
    alt={project.title}
    fill
    className="object-cover transition duration-500 hover:scale-105"
  />
</div>
              <h4 className="text-2xl font-semibold">
                {project.title}
              </h4>

              <p className="mt-4 text-zinc-400">
                {project.description}
              </p>

              <a
                href={project.link}
                target="_blank"
                className="mt-8 inline-block rounded-xl border border-zinc-700 px-5 py-3 text-sm transition hover:border-zinc-500 hover:bg-zinc-900"
              >
                {project.button}
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      <section
        id="about"
        className="relative z-10 border-t border-zinc-800 px-6 py-24"
      >
        <div className="mx-auto max-w-4xl">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
            About
          </p>

          <h3 className="mt-4 text-4xl font-bold">
            Process thinking meets creative AI.
          </h3>

          <p className="mt-8 text-lg leading-8 text-zinc-400">
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