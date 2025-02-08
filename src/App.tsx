import "./App.css";
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
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
  BookUser,
  Baby,
  Frown,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Theme Toggle Component
const ThemeToggle = ({
  theme,
  toggleTheme,
}: {
  theme: string;
  toggleTheme: () => void;
}) => (
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
);

// Sidebar Component with Submenu
const Sidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  sidebarItems,
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  sidebarItems: Array<{
    key: number;
    icon: JSX.Element;
    label: string;
    path?: string;
    subItems?: Array<{ key: number; label: string; path: string }>;
  }>;
}) => {
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);
  const navigate = useNavigate();

  return (
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
        {sidebarItems.map((item) => (
          <div key={item.key}>
            <div
              className="flex items-center justify-end p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => {
                if (item.subItems) {
                  setActiveSubmenu(activeSubmenu === item.key ? null : item.key);
                } else if (item.path) {
                  navigate(item.path);
                }
              }}
            >
              <span
                className={`ml-3 transition-opacity ${
                  isSidebarOpen ? "opacity-100" : "opacity-0"
                }`}
              >
                {item.label}
              </span>
              <span className="mr-3 pl-3">{item.icon}</span>
              {item.subItems && isSidebarOpen && (
                <span className="ml-2">
                  {activeSubmenu === item.key ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </span>
              )}
            </div>

            {isSidebarOpen && item.subItems && activeSubmenu === item.key && (
              <div className="pl-4 bg-gray-50 dark:bg-gray-700">
                {item.subItems.map((subItem) => (
                  <div
                    key={subItem.key}
                    className="flex items-center justify-end p-3 pr-6 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                    onClick={() => navigate(subItem.path)}
                  >
                    <span className="ml-3">{subItem.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

// Social Media Links Component
const SocialMediaLinks = ({
  socialMedia,
}: {
  socialMedia: Array<{
    key: number;
    icon: JSX.Element;
    link: string;
    label: string;
  }>;
}) => (
  <div className="flex items-center space-x-4">
    {socialMedia.map((social) => (
      <a
        key={social.key}
        href={social.link}
        className="text-white hover:text-gray-300 transition-colors"
        aria-label={social.label}
      >
        {social.icon}
      </a>
    ))}
  </div>
);

// Placeholder Components for Routes
const Dashboard = () => (
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
);


const RegisterCitizen = () => (
  <div className="p-4 text-right">تسجيل مواطن</div>
);
const MarriageRegistration = () => (
  <div className="p-4 text-right">تسجيل واقعة الزواج</div>
);
const BirthRegistration = () => (
  <div className="p-4 text-right">تسجيل واقعة الولادة</div>
);
const DivorceRegistration = () => (
  <div className="p-4 text-right">تسجيل واقعة الطلاق</div>
);
const DeathRegistration = () => (
  <div className="p-4 text-right">تسجيل واقعة الوفاة</div>
);

// App Component
function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(isDark ? "dark" : "light");
      document.documentElement.classList.toggle("dark", isDark);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  const sidebarItems = [
    { key: 0, icon: <LayoutGrid />, label: "لوحة التحكم", path: "/" },
    {
      key: 1,
      icon: <BookUser />,
      label: "السجل المدني",
      subItems: [
        { key: 11, label: "تسجيل مواطن", path: "/civil-registry/register-citizen" },
        { key: 12, label: "تسجيل واقعة الزواج", path: "/civil-registry/marriage" },
        { key: 13, label: "تسجيل واقعة الولادة", path: "/civil-registry/birth" },
        { key: 14, label: "تسجيل واقعة الطلاق", path: "/civil-registry/divorce" },
        { key: 15, label: "تسجيل واقعة الوفاة", path: "/civil-registry/death" },
      ],
    },
    {
      key: 2,
      icon: <Users />,
      label: "الجوازات",
      subItems: [
        { key: 21, label: "اصدار جواز", path: "/passports/issue-passport" },
        { key: 22, label: "اصدار وثيقة سفر", path: "/passports/travel-document" },
        { key: 23, label: "الطلبات المكتملة", path: "/passports/completed-requests" },
      ],
    },
    {
      key: 3,
      icon: <Users />,
      label: "التأشيرات",
      subItems: [
        { key: 31, label: "طلب جديد", path: "/visas/new-request" },
        { key: 32, label: "الطلبات المعلقة", path: "/visas/pending-requests" },
        { key: 33, label: "الطلبات المكتملة", path: "/visas/completed-requests" },
      ],
    },
    {
      key: 4,
      icon: <Baby />,
      label: "التصديقات",
      subItems: [
        { key: 41, label: "تصديق محلي", path: "/attestations/local" },
        { key: 42, label: "تصديق دولي", path: "/attestations/international" },
      ],
    },
    {
      key: 5,
      icon: <Frown />,
      label: "التوكيلات",
      subItems: [
        { key: 51, label: "توكيل للمحاكم", path: "/proxies/court" },
        { key: 52, label: "توكيل مصرفي", path: "/proxies/bank" },
        { key: 53, label: "توكيل طلاق", path: "/proxies/divorce" },
        { key: 54, label: "توكيل عقاري", path: "/proxies/real-estate" },
        { key: 55, label: "توكيل الفريضة الشرعية", path: "/proxies/inheritance" },
        { key: 56, label: "توكيل إتمام مستندات", path: "/proxies/document-completion" },
        { key: 57, label: "توكيل عام", path: "/proxies/general" },
      ],
    },
    { key: 6, icon: <BarChart2 />, label: "التقارير", path: "/reports" },
    { key: 7, icon: <Settings />, label: "الإعدادات", path: "/settings" },
  ];

  const socialMedia = [
    { key: 0, icon: <Twitter />, link: "#", label: "Twitter" },
    { key: 1, icon: <Facebook />, link: "#", label: "Facebook" },
    { key: 2, icon: <Instagram />, link: "#", label: "Instagram" },
    { key: 3, icon: <Linkedin />, link: "#", label: "LinkedIn" },
  ];

  return (
    <Router>
      <div
        className={`flex flex-col h-dvh font-sans ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-100"
        }`}
      >
        {/* Topbar */}
        <div className="bg-red-800 dark:bg-red-950 dark:text-white text-white shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-end p-2">
              <span className="font-semibold text-sm pr-4 text-white">
                محمد أحمد
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 pr-4">
                مسؤول
              </span>
            </div>
            <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600"></div>
            <button
              className="text-white hover:text-gray-200 lg:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu />
            </button>
            <Bell />
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
          <h3 className="text-lg font-semibold ">وزارة الخارجية الليبية</h3>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex bg-gray-50 dark:bg-gray-900">
          <div className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/civil-registry/register-citizen" element={<RegisterCitizen />} />
              <Route path="/civil-registry/marriage" element={<MarriageRegistration />} />
              <Route path="/civil-registry/birth" element={<BirthRegistration />} />
              <Route path="/civil-registry/divorce" element={<DivorceRegistration />} />
              <Route path="/civil-registry/death" element={<DeathRegistration />} />
              {/* Add more routes for other paths */}
              <Route path="/reports" element={<div>التقارير</div>} />
              <Route path="/settings" element={<div>الإعدادات</div>} />
            </Routes>
          </div>
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            sidebarItems={sidebarItems}
          />
        </div>

        {/* Footer */}
        <footer className="shadow-md p-4 text-right bg-emerald-900 dark:bg-emerald-950 text-white">
          <div className="flex justify-between items-center">
            <SocialMediaLinks socialMedia={socialMedia} />
            <div className="text-sm text-white">
              © 2024 لوحة المعلومات. جميع الحقوق محفوظة
            </div>
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
    </Router>
  );
}

export default App;