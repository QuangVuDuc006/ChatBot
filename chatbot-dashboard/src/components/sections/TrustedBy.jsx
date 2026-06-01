import React from "react";
import { motion } from "framer-motion";
import { Shield, Sparkles } from "lucide-react";
import { trustedLogos } from "../../data/landingData";
import { staggerContainer, revealVariants } from "../../utils/motion";
import { PlatformTicker } from "../ui/PlatformTicker";

export function TrustedBy() {
  return (
    <motion.div
      className="mx-auto mt-28 grid max-w-4xl justify-items-center gap-8"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.p variants={revealVariants} className="text-sm font-medium text-white">
        Built for research, writing, planning, and support workflows
      </motion.p>
      <motion.div variants={staggerContainer} className="grid w-full grid-cols-2 gap-5 md:grid-cols-4">
        {trustedLogos.map((logo, index) => (
          <motion.div
            key={`${logo}-${index}`}
            variants={revealVariants}
            className={`flex items-center justify-center gap-2 text-sm font-bold ${
              index === 1 || index === 2 ? "text-white" : "text-white/25"
            }`}
          >
            <span className="grid h-6 w-6 place-items-center rounded-[6px]">
              {index % 2 === 0 ? <Sparkles size={22} fill="currentColor" /> : <Shield size={22} fill="currentColor" />}
            </span>
            <span>{logo}</span>
          </motion.div>
        ))}
      </motion.div>
      <motion.div variants={revealVariants} className="w-full max-w-3xl">
        <PlatformTicker />
      </motion.div>
    </motion.div>
  );
}
