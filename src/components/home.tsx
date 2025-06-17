import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Camera, Sparkles, Heart } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4 md:p-8 bg-background">
      {/* Decorative elements */}
      <motion.div
        className="absolute top-10 right-10 text-gray-400"
        animate={{
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <Sparkles size={32} />
      </motion.div>

      <motion.div
        className="absolute bottom-20 left-10 text-gray-500"
        animate={{
          y: [0, -10, 0],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <Heart size={28} />
      </motion.div>

      {/* Logo and title */}
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-2">
          더함네컷
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 font-medium">
          Deoham Necut
        </p>
      </motion.div>

      {/* Hero image */}
      <motion.div
        className="relative w-full max-w-md mb-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="bg-white p-4 rounded-3xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-2 gap-2">
            <img
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80"
              alt="Sample collage"
              className="rounded-xl aspect-square object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&q=80"
              alt="Sample collage"
              className="rounded-xl aspect-square object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80"
              alt="Sample collage"
              className="rounded-xl aspect-square object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80"
              alt="Sample collage"
              className="rounded-xl aspect-square object-cover"
            />
          </div>
        </div>

        {/* Decorative elements on the collage */}
        <motion.div
          className="absolute -top-3 -right-3 bg-gray-200 rounded-full p-2 shadow-md"
          animate={{
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <Sparkles size={20} className="text-gray-600" />
        </motion.div>

        <motion.div
          className="absolute -bottom-3 -left-3 bg-gray-300 rounded-full p-2 shadow-md"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <Heart size={20} className="text-gray-700" />
        </motion.div>
      </motion.div>

      {/* Description */}
      <motion.p
        className="text-center text-gray-600 mb-8 max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        Create your own Korean-style photo booth collages! Take 8 photos, pick
        your favorites, and make a cute customized collage.
      </motion.p>

      {/* Start button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link to="/capture">
          <Button
            size="lg"
            className="bg-gray-800 hover:bg-gray-900 text-white rounded-full px-8 py-6 text-lg font-medium shadow-lg flex items-center gap-2"
          >
            <Camera size={24} />
            Start Taking Photos
          </Button>
        </Link>
      </motion.div>

      {/* Footer */}
      <div className="mt-auto pt-12 text-center text-gray-500 text-sm">
        <p>© 2023 Deoham Necut (더함네컷) • All Rights Reserved</p>
      </div>
    </div>
  );
};

export default Home;
