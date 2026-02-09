import { motion, AnimatePresence } from "framer-motion";
import { X, LogOut } from "lucide-react";

export default function LogoutModal({ onClose, onConfirm }) {
    const handleLogout = async () => {
        try {
            // Call the logout handler
            await onConfirm();
        } catch (error) {
            console.error("Logout error:", error);
            // Error is handled by the parent component
        }
    };

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
                    className="relative bg-[#0e1628] text-white rounded-2xl w-[90%] max-w-md p-6 shadow-2xl border border-red-500/20"
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

                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                            <LogOut size={32} className="text-red-400" />
                        </div>
                    </div>

                    {/* Content */}
                    <h2 className="text-2xl font-bold mb-2 text-center">
                        Logout Confirmation
                    </h2>

                    <p className="text-gray-400 text-sm text-center mb-6">
                        Are you sure you want to logout? You'll need to login again to access your dashboard.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 transition font-semibold text-lg"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 transition font-semibold text-lg"
                        >
                            Logout
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
