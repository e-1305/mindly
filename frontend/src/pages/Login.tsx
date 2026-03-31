import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../lib/store";
import { firebaseLogin } from "../lib/firebase";

export default function Login() {
  const { setUser } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const demoLogin = (role: "employee" | "manager" | "hr") => {
    const profiles = {
      employee: { id: "emp-1",  name: "Alex Dupont",    email: "alex@company.com"     },
      manager:  { id: "mgr-1",  name: "Sophie Martin",  email: "sophie@company.com"   },
      hr:       { id: "hr-1",   name: "Isabelle Roux",  email: "isabelle@company.com" },
    };
    const p = profiles[role];
    setUser({ ...p, role, teamId: "team-1" }, "demo-token");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const cred = await firebaseLogin(email, password);
      const token = await cred.user.getIdToken();
      // Role is stored in Firebase custom claims or defaulted to employee
      const role = (email.includes("manager") || email.includes("sophie")) ? "manager" : "employee";
      setUser(
        {
          id: cred.user.uid,
          name: cred.user.displayName ?? email.split("@")[0],
          email: cred.user.email ?? email,
          role,
          teamId: "team-1",
        },
        token
      );
    } catch {
      setError("Invalid credentials. Try the demo buttons below.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-100 via-white to-violet-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background blobs */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-primary-200/40 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute -bottom-24 -right-16 w-80 h-80 rounded-full bg-violet-200/40 blur-3xl pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="w-full max-w-sm relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-primary-600 tracking-tight">mindly</h1>
          <p className="text-gray-400 mt-2 text-sm">Your daily mental check-in</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-card p-8 space-y-4"
        >
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-300 text-sm bg-white"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-300 text-sm bg-white"
            />
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-500 text-xs"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 bg-primary-600 text-white rounded-2xl font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                  Signing in…
                </motion.span>
              ) : "Sign in"}
            </motion.button>
          </form>

          <div className="border-t border-gray-100 pt-4 space-y-2">
            <p className="text-xs text-gray-400 text-center">Demo access</p>
            <div className="flex gap-2">
              {(["employee", "manager", "hr"] as const).map((role) => (
                <motion.button
                  key={role}
                  onClick={() => demoLogin(role)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex-1 py-2.5 text-sm rounded-2xl border border-primary-200 text-primary-600 hover:bg-primary-50 transition-colors capitalize font-medium"
                >
                  {role}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
