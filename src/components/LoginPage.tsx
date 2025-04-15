import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Lock, LogIn } from "lucide-react";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("يرجى إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }
    // Demo: Accept any input
    setError("");
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 to-emerald-900 dark:from-gray-900 dark:to-gray-800" dir="rtl">
      <motion.div
        className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-md"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold text-center text-red-800 dark:text-emerald-400 mb-6">تسجيل الدخول</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">البريد الإلكتروني</label>
            <div className="relative">
              <input
                type="email"
                className="w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-800 dark:bg-gray-800 dark:text-white"
                value={email}
                onChange={e => setEmail(e.target.value)}
                dir="ltr"
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">كلمة المرور</label>
            <div className="relative">
              <input
                type="password"
                className="w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-800 dark:bg-gray-800 dark:text-white"
                value={password}
                onChange={e => setPassword(e.target.value)}
                dir="ltr"
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2 bg-red-800 hover:bg-red-900 text-white rounded-md font-semibold transition-colors duration-200"
          >
            <LogIn size={18} /> دخول
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
          ليس لديك حساب؟
          <a href="/signup" className="text-red-800 dark:text-emerald-400 font-semibold hover:underline mx-1">إنشاء حساب</a>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
