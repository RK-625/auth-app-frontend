import { motion } from "framer-motion";

export const AtmosphericBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#09090b]">
      {/* Subtle Grain Overlay for a "Film" look */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Modern Gradient Mask */}
      <div className="absolute inset-0 bg-gradient-to-tr from-zinc-950 via-zinc-950/80 to-transparent" />
      
      {/* Interactive Light Follower */}
      <motion.div 
        className="absolute h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[120px]"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 15, repeat: Infinity }}
      />
    </div>
  );
};
