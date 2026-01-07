import { motion, AnimatePresence } from "framer-motion"; // eslint-disable-line no-unused-vars
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LoginModal({ onClose }) {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {/* Overlay */}
      <motion.div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose} // close on outside click
      >
        {/* Modal Box */}
        <motion.div
          className="relative bg-[#0e1628] text-white rounded-2xl w-[90%] max-w-md p-6 shadow-2xl"
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()} // prevent close on modal click
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
          >
            <X size={20} />
          </button>

          {/* Content */}
          <h2 className="text-2xl font-bold mb-2 text-center">
            Login Required
          </h2>

          <p className="text-gray-400 text-sm text-center mb-6">
            Please login to access this feature
          </p>

          <button
            onClick={() => {
              onClose();
              navigate("/login");
            }}
            className="w-full py-3 rounded-xl bg-[#3abbf5] hover:bg-blue-500 transition font-semibold text-lg"
          >
            Login
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
