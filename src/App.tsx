import "./App.css"
import { useState, useEffect } from "react"
import {
  LayoutGrid,
  Users,
  BarChart2,
  Settings,
  Menu,
  Bell,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Sun,
  Moon,
} from "lucide-react"

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [theme, setTheme] = useState("dark")

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle("dark", savedTheme === "dark")
    } else {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setTheme(isDark ? "dark" : "light")
      document.documentElement.classList.toggle("dark", isDark)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
    localStorage.setItem("theme", newTheme)
  }

  const sidebarItems = [
    { icon: <LayoutGrid />, label: "لوحة التحكم" },
    { icon: <Users />, label: "المستخدمون" },
    { icon: <BarChart2 />, label: "التقارير" },
    { icon: <Settings />, label: "الإعدادات" },
  ]

  const socialMedia = [
    { icon: <Twitter />, link: "#", label: "Twitter" },
    { icon: <Facebook />, link: "#", label: "Facebook" },
    { icon: <Instagram />, link: "#", label: "Instagram" },
    { icon: <Linkedin />, link: "#", label: "LinkedIn" },
  ]

  return (
    <div className={`flex flex-col h-dvh font-sans ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
    }`}>
      {/* Topbar */}
      <div className="bg-red-800 dark:bg-red-950 dark:text-white text-white shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            className="text-white hover:text-gray-200 lg:hidden" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu />
          </button>
          <Bell />
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-red-700 dark:hover:bg-red-900 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="text-yellow-500" />
            ) : (
              <Moon className="text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex bg-gray-50 dark:bg-gray-900">
        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 w-full max-w-full mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full">
              {["المبيعات", "المستخدمون", "الإيرادات"].map((title, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-4 md:p-6 rounded-lg shadow-md text-right w-full ring-2 ring-gray-200 dark:ring-gray-700"
                >
                  <h3 className="text-lg font-semibold mb-4">{title}</h3>
                  <p className="text-3xl font-bold">1,234</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div
          className={`bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 flex flex-col ${
            isSidebarOpen ? "w-64" : "w-20"
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
            >
              <Menu />
            </button>
            <h2
              className={`text-xl font-bold transition-opacity text-gray-900 dark:text-white ${
                isSidebarOpen ? "opacity-100" : "opacity-0"
              }`}
            >
              لوحة المعلومات
            </h2>
          </div>

          <nav className="py-4 flex-1 text-gray-900 dark:text-white">
            {sidebarItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-end p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              >
                <span className={`ml-3 transition-opacity ${isSidebarOpen ? "opacity-100" : "opacity-0"}`}>
                  {item.label}
                </span>
                <span className="mr-3 pl-3">{item.icon}</span>
              </div>
            ))}
          </nav>

          {/* User Avatar */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end space-x-3 space-x-reverse">
            <div className="flex flex-col items-end p-2">
              <span className="font-semibold text-sm pr-4 text-gray-900 dark:text-white">محمد أحمد</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 pr-4">مسؤول</span>
            </div>
            <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600"></div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="shadow-md p-4 text-right bg-emerald-900 dark:bg-emerald-950 text-white">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {socialMedia.map((social, index) => (
              <a
                key={index}
                href={social.link}
                className="text-white hover:text-gray-300 transition-colors"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
          <div className="text-sm text-white">© 2024 لوحة المعلومات. جميع الحقوق محفوظة</div>
          <div className="space-x-4 space-x-reverse">
            <a href="#" className="text-sm text-white hover:text-gray-300">
              سياسة الخصوصية
            </a>
            <a href="#" className="text-sm text-white hover:text-gray-300">
              شروط الاستخدام
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App