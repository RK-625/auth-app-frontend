import { motion } from "framer-motion";

export const InteractiveLogo = () => (
  <motion.div 
    whileHover={{ scale: 1.05 }}
    className="flex items-center cursor-pointer"
  >
    <span className="font-bold tracking-[0.2em] text-zinc-900 dark:text-white uppercase text-sm">
      DEMO
    </span>
  </motion.div>
);
