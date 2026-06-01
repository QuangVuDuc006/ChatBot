import React from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/Button";
import { Reveal } from "../ui/Reveal";

export function CTA() {
  return (
    <section id="contact" className="px-6 py-20 md:px-16 md:py-28">
      <Reveal>
        <motion.div
          className="relative mx-auto grid max-w-2xl justify-items-center overflow-hidden rounded-[12px] border border-white/10 bg-white/[0.045] px-8 py-16 text-center shadow-card"
          whileHover={{ y: -4, scale: 1.006 }}
          transition={{ type: "spring", stiffness: 150, damping: 24 }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(141,77,232,0.32),transparent_38%),radial-gradient(circle_at_100%_100%,rgba(111,52,197,0.34),transparent_40%)]" />
          <div className="relative z-10">
            <h2 className="text-balance text-4xl font-semibold leading-[1.03] tracking-[-0.06em] text-white md:text-5xl">
              Start your next AI research session in one workspace
            </h2>
            <p className="mt-5 text-sm font-medium text-mist-200">Open the chat app, choose a model, upload files, and keep the conversation saved.</p>
            <Button href="/chat" className="mt-6" icon>
              Start chatting
            </Button>
          </div>
        </motion.div>
      </Reveal>
    </section>
  );
}
