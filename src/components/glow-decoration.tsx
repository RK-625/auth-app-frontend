import React from "react";
import { motion } from "framer-motion";

export function GlowDecoration() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-black/20 backdrop-blur-2xl">
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-[20%] -left-[20%] h-[140%] w-[140%] bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.15),transparent_70%)]"
        />
      </div>
      
      <div className="relative z-10 flex flex-col items-center gap-6 p-12 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/20 ring-1 ring-primary/40 backdrop-blur-xl">
           <div className="h-12 w-12 rounded-full bg-primary shadow-[0_0_40px_rgba(244,63,94,0.6)]" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-white">Security by Design</h2>
          <p className="text-sm text-white/50">
            Advanced encryption and multi-step verification protecting your digital identity.
          </p>
        </div>
      </div>

      {/* Decorative Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.05]" 
           style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
      />
    </div>
  );
}
