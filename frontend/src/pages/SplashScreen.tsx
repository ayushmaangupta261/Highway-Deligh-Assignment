import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const SplashScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Container with 3D hover effect */}
      <motion.div
        className="p-10 rounded-2xl shadow-xl bg-white"
        whileHover={{ rotateY: 10, rotateX: 10, scale: 1.05 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
      >
        {/* Title */}
        <motion.h1
          className="text-4xl font-extrabold mb-4 text-[#367AFF]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to HD
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-gray-600 mb-6 text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Your journey starts here{" "}
          <motion.span
            className="inline-block"
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          >
            🚀
          </motion.span>
        </motion.p>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <Link
            to="/authPage"
            className="bg-[#367AFF] text-white px-6 py-3 rounded-xl shadow-lg hover:bg-blue-600 hover:shadow-2xl transition-all"
          >
            Get Started
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SplashScreen;
 