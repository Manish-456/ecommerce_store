import { motion } from "framer-motion";
import { UserPlus, Mail, Lock, User, ArrowRight, Loader } from "lucide-react";

export default function SignupForm() {
  return (
    <>
      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="mt-6 text-center  text-2xl font-bold text-emerald-400">
          Create your account
        </h2>
      </motion.div>
    </>
  );
}
