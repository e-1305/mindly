import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Clock, LogOut, CheckCircle, Pencil, X } from "lucide-react";
import Card from "../components/Card";
import NavBar from "../components/NavBar";
import AvatarBuilder from "../components/AvatarBuilder";
import Avatar from "../components/Avatar";
import { useAuthStore } from "../lib/store";
import { AvatarConfig, loadAvatar, saveAvatar as persistAvatar } from "../lib/avatarTypes";

const TIMES = ["08:00", "09:00", "10:00", "12:00", "14:00", "17:00", "18:00", "20:00"];

export default function Settings() {
  const { user, logout } = useAuthStore();

  const [notifTime, setNotifTime] = useState(() => localStorage.getItem("mindly-notif-time") ?? "09:00");
  const [timeSaved, setTimeSaved] = useState(false);

  // Avatar state
  const [savedConfig, setSavedConfig] = useState<AvatarConfig>(loadAvatar);
  const [draftConfig, setDraftConfig] = useState<AvatarConfig>(loadAvatar);
  const [editing, setEditing] = useState(false);

  const saveTime = (t: string) => {
    setNotifTime(t);
    localStorage.setItem("mindly-notif-time", t);
    setTimeSaved(true);
    setTimeout(() => setTimeSaved(false), 2000);
  };

  const handleSaveAvatar = () => {
    persistAvatar(draftConfig);
    setSavedConfig(draftConfig);
    setEditing(false);
  };

  const handleCancelAvatar = () => {
    setDraftConfig(savedConfig);
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-surface-muted pb-28 pt-6 md:pt-20 px-4">
      <div className="max-w-md mx-auto space-y-4">
        <motion.h1 initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-2xl font-bold text-gray-800">
          Settings
        </motion.h1>

        {/* Profile card */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card>
            <div className="flex items-center gap-4">
              <Avatar config={savedConfig} size={56} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800">{user?.name}</p>
                <p className="text-sm text-gray-400 truncate">{user?.email}</p>
                <span className="inline-block mt-1 text-xs bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full capitalize">
                  {user?.role}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => { setDraftConfig(savedConfig); setEditing(true); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-primary-50 text-primary-600 text-xs font-semibold hover:bg-primary-100 transition-colors shrink-0"
              >
                <Pencil size={13} />
                Edit avatar
              </motion.button>
            </div>
          </Card>
        </motion.div>

        {/* Avatar builder — expands inline */}
        <AnimatePresence>
          {editing && (
            <motion.div
              key="builder"
              initial={{ opacity: 0, height: 0, y: -8 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -8 }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
              className="overflow-hidden"
            >
              <Card className="border-2 border-primary-100">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-semibold text-gray-800 text-sm">Customize your avatar</p>
                  <button onClick={handleCancelAvatar} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <X size={18} />
                  </button>
                </div>

                <AvatarBuilder config={draftConfig} onChange={setDraftConfig} />

                <div className="flex gap-2 mt-5">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSaveAvatar}
                    className="flex-1 py-3 bg-primary-600 text-white rounded-2xl text-sm font-semibold hover:bg-primary-700 transition-colors"
                  >
                    Save avatar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleCancelAvatar}
                    className="px-5 py-3 rounded-2xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </motion.button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notification time */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Bell size={16} className="text-primary-500" />
              <p className="font-semibold text-gray-700 text-sm">Daily reminder</p>
              <AnimatePresence>
                {timeSaved && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    className="ml-auto flex items-center gap-1 text-xs text-green-500"
                  >
                    <CheckCircle size={12} /> Saved
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {TIMES.map((t) => (
                <motion.button
                  key={t}
                  onClick={() => saveTime(t)}
                  whileTap={{ scale: 0.93 }}
                  className={`py-2 rounded-2xl text-sm font-medium transition-all ${
                    notifTime === t ? "bg-primary-600 text-white shadow-md" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {t}
                </motion.button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
              <Clock size={11} /> You'll receive your check-in prompt at this time.
            </p>
          </Card>
        </motion.div>

        {/* Privacy */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card>
            <p className="text-sm font-semibold text-gray-700 mb-2">Your privacy</p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Your individual responses are never shared with your manager or HR.
              Only anonymized, aggregated trends are visible to your team.
            </p>
          </Card>
        </motion.div>

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-3xl border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition-colors"
        >
          <LogOut size={16} />
          Sign out
        </motion.button>
      </div>
      <NavBar />
    </div>
  );
}
