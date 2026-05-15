import { motion } from "framer-motion";

export const InteractiveLogo = () => (
  <motion.div 
    whileHover={{ scale: 1.05 }}
    className="flex items-center cursor-pointer"
  >
    <span className="font-bold tracking-[0.2em] text-foreground uppercase text-sm">
      DEMO
    </span>
  </motion.div>
);
