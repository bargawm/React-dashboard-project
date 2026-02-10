
import { motion } from "framer-motion";

export const Card = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.04 }}
    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
  >
    {children}
  </motion.div>
);

export const Button = ({ children, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    className="px-6 py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 font-bold text-black"
    onClick={onClick}
  >
    {children}
  </motion.button>
);
