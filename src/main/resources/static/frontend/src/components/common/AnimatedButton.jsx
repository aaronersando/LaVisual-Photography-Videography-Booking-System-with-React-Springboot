import { motion } from "framer-motion";

function AnimatedButton({ children, className, ...props }) {
  return (
    <motion.button
      className={`relative overflow-hidden px-6 py-3 rounded-md text-white font-medium ${className}`}
      whileHover={{
        scale: 1.1,
        background: "linear-gradient(90deg, #9333EA, #C084FC)",
      }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export default AnimatedButton;