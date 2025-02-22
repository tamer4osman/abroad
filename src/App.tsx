import "./App.css";
import { useState, useEffect, lazy, Suspense, useCallback, memo } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  BarChart2,
  Menu,
  Bell,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Sun,
  Moon,
  ChevronDown,
  ChevronUp,
  Settings,
  Handshake,
  Home,
  Book,
  FileArchive,
  FileText,
  FileCheck,
} from "lucide-react";

// Lazy-loaded components for code splitting
const Dashboard = lazy(() => import("./components/Dashboard"));
const RegisterCitizen = lazy(() => import("./components/RegisterCitizen"));
const MarriageRegistration = lazy(() => import("./components/MarriageRegistration"));
const BirthRegistration = lazy(() => import("./components/BirthRegistration"));
const DivorceRegistration = lazy(() => import("./components/DivorceRegistration"));
const DeathRegistration = lazy(() => import("./components/DeathRegistration"));
const Reports = lazy(() => import("./components/Reports"));
const SettingsComponent = lazy(() => import("./components/SettingsComponent"));
const IssuePassport = lazy(() => import("./components/IssuePassport"));
const TravelDocument = lazy(() => import("./components/TravelDocument"));
const CompletedRequestsPassports = lazy(() => import("./components/CompletedRequestsPassports"));
const NewRequestVisas = lazy(() => import("./components/NewRequestVisas"));
const PendingRequestsVisas = lazy(() => import("./components/PendingRequestsVisas"));
const CompletedRequestsVisas = lazy(() => import("./components/CompletedRequestsVisas"));
const LocalAttestation = lazy(() => import("./components/LocalAttestation"));
const InternationalAttestation = lazy(() => import("./components/InternationalAttestation"));
const CourtProxy = lazy(() => import("./components/CourtProxy"));
const BankProxy = lazy(() => import("./components/BankProxy"));
const DivorceProxy = lazy(() => import("./components/DivorceProxy"));
const RealEstateProxy = lazy(() => import("./components/RealEstateProxy"));
const InheritanceProxy = lazy(() => import("./components/InheritanceProxy"));
const DocumentCompletionProxy = lazy(() => import("./components/DocumentCompletionProxy"));
const GeneralProxy = lazy(() => import("./components/GeneralProxy"));

interface ThemeToggleProps {
  theme: string;
  toggleTheme: () => void;
}

// Memoized ThemeToggle component
const ThemeToggle = memo<ThemeToggleProps>(({ theme, toggleTheme }) => (
  <button
    onClick={toggleTheme}
    className="p-2 rounded-lg hover:bg-red-700 dark:hover:bg-red-900 transition-colors"
    aria-label="Toggle theme"
  >
    {theme === "dark" ? <Sun className="text-yellow-500" /> : <Moon className="text-gray-700" />}
  </button>
));

interface SocialMediaLinksProps {
  socialMedia: { key: number; icon: React.ReactNode; link: string; label: string }[];
}

// Memoized SocialMediaLinks component
const SocialMediaLinks = memo<SocialMediaLinksProps>(({ socialMedia }) => (
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
));

// Memoized Topbar component
interface TopbarProps {
  theme: string;
  toggleTheme: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const Topbar = memo<TopbarProps>(({ theme, toggleTheme, isSidebarOpen, setIsSidebarOpen }) => (
  <div className="bg-red-800 dark:bg-red-950 dark:text-white text-white shadow-sm p-4 flex items-center justify-between">
    <div className="flex items-center space-x-4">
      <div className="flex flex-col items-end p-2">
        <span className="font-semibold text-sm pr-4 text-white">محمد أحمد</span>
        <span className="text-xs text-gray-500 dark:text-gray-400 pr-4">مسؤول</span>
      </div>
      <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600"></div>
      <button
        className="text-white hover:text-gray-200 lg:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle sidebar"
      >
        <Menu />
      </button>
      <Bell />
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
    </div>
    <h3 className="text-lg font-semibold">وزارة الخارجية الليبية</h3>
  </div>
));

interface FooterProps {
  socialMedia: { key: number; icon: React.ReactNode; link: string; label: string }[];
}

// Memoized Footer component
const Footer = memo<FooterProps>(({ socialMedia }) => (
  <footer className="shadow-md p-4 text-right bg-emerald-900 dark:bg-emerald-950 text-white">
    <div className="flex justify-between items-center">
      <SocialMediaLinks socialMedia={socialMedia} />
      <div className="text-sm text-white">© 2024 لوحة المعلومات. جميع الحقوق محفوظة</div>
      <div className="space-x-4 space-x-reverse">
        <a href="#" className="text-sm text-white hover:text-gray-300">سياسة الخصوصية</a>
        <a href="#" className="text-sm text-white hover:text-gray-300">شروط الاستخدام</a>
      </div>
    </div>
  </footer>
));

interface SidebarItem {
  key: number;
  icon: React.ReactNode;
  label: string;
  path?: string;
  subItems?: Omit<SidebarItem, 'subItems'>[];
}

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  sidebarItems: SidebarItem[];
}

// Memoized Sidebar component with optimized rendering
const Sidebar = memo<SidebarProps>(({ isSidebarOpen, setIsSidebarOpen, sidebarItems }) => {
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const activeItem = sidebarItems.find((item) =>
      item.subItems?.some((sub) => sub.path === currentPath)
    );
    if (activeItem) setActiveSubmenu(activeItem.key);
  }, [currentPath, sidebarItems]);

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarOpen(!isSidebarOpen);
  }, [isSidebarOpen, setIsSidebarOpen]);

  return (
    <div
      className={`bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 flex flex-col ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={handleToggleSidebar}
          className="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Toggle sidebar"
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
        {sidebarItems.map((item) => {
          const isActive = item.subItems
            ? item.subItems.some((sub) => sub.path === currentPath)
            : item.path === currentPath;
          return (
            <div key={item.key}>
              <div
                className={`flex items-center justify-end p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
                  isActive ? "bg-gray-200 dark:bg-gray-700" : ""
                }`}
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
                    {activeSubmenu === item.key ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </span>
                )}
              </div>
              {isSidebarOpen && item.subItems && activeSubmenu === item.key && (
                <div className="pl-4 bg-gray-50 dark:bg-gray-700">
                  {item.subItems.map((subItem) => (
                    <div
                      key={subItem.key}
                      className={`flex items-center justify-end p-3 pr-6 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer ${
                        subItem.path === currentPath ? "bg-gray-200 dark:bg-gray-700" : ""
                      }`}
                      onClick={() => {
                        if (subItem.path) {
                          navigate(subItem.path);
                        }
                      }}
                    >
                      <span className="ml-3">{subItem.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
});

// Main App component with optimized state management
function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const initialTheme = savedTheme
      ? savedTheme
      : window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", newTheme === "dark");
      localStorage.setItem("theme", newTheme);
      return newTheme;
    });
  }, []);

  const sidebarItems = [
    { key: 0, icon: <Home />, label: "لوحة التحكم", path: "/" },
    {
      key: 1,
      icon: <Book />,
      label: "السجل المدني",
      subItems: [
        { key: 11, icon: <></>, label: "تسجيل مواطن", path: "/civil-registry/register-citizen" },
        { key: 12, icon: <></>, label: "تسجيل واقعة الزواج", path: "/civil-registry/marriage" },
        { key: 13, icon: <></>, label: "تسجيل واقعة الولادة", path: "/civil-registry/birth" },
        { key: 14, icon: <></>, label: "تسجيل واقعة الطلاق", path: "/civil-registry/divorce" },
        { key: 15, icon: <></>, label: "تسجيل واقعة الوفاة", path: "/civil-registry/death" },
      ],
    },
    {
      key: 2,
      icon: <FileArchive />,
      label: "الجوازات",
      subItems: [
        { key: 21, icon: <></>, label: "اصدار جواز", path: "/passports/issue-passport" },
        { key: 22, icon: <></>, label: "اصدار وثيقة سفر", path: "/passports/travel-document" },
        { key: 23, icon: <></>, label: "الطلبات المكتملة", path: "/passports/completed-requests" },
      ],
    },
    {
      key: 3,
      icon: <FileCheck />,
      label: "التأشيرات",
      subItems: [
        { key: 31, icon: <></>, label: "طلب جديد", path: "/visas/new-request" },
        { key: 32, icon: <></>, label: "الطلبات المعلقة", path: "/visas/pending-requests" },
        { key: 33, icon: <></>, label: "الطلبات المكتملة", path: "/visas/completed-requests" },
      ],
    },
    {
      key: 4,
      icon: <FileText />,
      label: "التصديقات",
      subItems: [
        { key: 41, icon: <></>, label: "تصديق محلي", path: "/attestations/local" },
        { key: 42, icon: <></>, label: "تصديق دولي", path: "/attestations/international" },
      ],
    },
    {
      key: 5,
      icon: <Handshake />,
      label: "التوكيلات",
      subItems: [
        { key: 51, icon: <></>, label: "توكيل للمحاكم", path: "/proxies/court" },
        { key: 52, icon: <></>, label: "توكيل مصرفي", path: "/proxies/bank" },
        { key: 53, icon: <></>, label: "توكيل طلاق", path: "/proxies/divorce" },
        { key: 54, icon: <></>, label: "توكيل عقاري", path: "/proxies/real-estate" },
        { key: 55, icon: <></>, label: "توكيل الفريضة الشرعية", path: "/proxies/inheritance" },
        { key: 56, icon: <></>, label: "توكيل إتمام مستندات", path: "/proxies/document-completion" },
        { key: 57, icon: <></>, label: "توكيل عام", path: "/proxies/general" },
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
      <div className={`flex flex-col h-dvh font-sans ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"}`}>
        <Topbar
          theme={theme}
          toggleTheme={toggleTheme}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <div className="flex-1 flex bg-gray-50 dark:bg-gray-900">
          <div className="flex-1 overflow-y-auto">
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/civil-registry/register-citizen" element={<RegisterCitizen />} />
                <Route path="/civil-registry/marriage" element={<MarriageRegistration />} />
                <Route path="/civil-registry/birth" element={<BirthRegistration />} />
                <Route path="/civil-registry/divorce" element={<DivorceRegistration />} />
                <Route path="/civil-registry/death" element={<DeathRegistration />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<SettingsComponent />} />
                <Route path="/passports/issue-passport" element={<IssuePassport />} />
                <Route path="/passports/travel-document" element={<TravelDocument />} />
                <Route path="/passports/completed-requests" element={<CompletedRequestsPassports />} />
                <Route path="/visas/new-request" element={<NewRequestVisas />} />
                <Route path="/visas/pending-requests" element={<PendingRequestsVisas />} />
                <Route path="/visas/completed-requests" element={<CompletedRequestsVisas />} />
                <Route path="/attestations/local" element={<LocalAttestation />} />
                <Route path="/attestations/international" element={<InternationalAttestation />} />
                <Route path="/proxies/court" element={<CourtProxy />} />
                <Route path="/proxies/bank" element={<BankProxy />} />
                <Route path="/proxies/divorce" element={<DivorceProxy />} />
                <Route path="/proxies/real-estate" element={<RealEstateProxy />} />
                <Route path="/proxies/inheritance" element={<InheritanceProxy />} />
                <Route path="/proxies/document-completion" element={<DocumentCompletionProxy />} />
                <Route path="/proxies/general" element={<GeneralProxy />} />
              </Routes>
            </Suspense>
          </div>
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            sidebarItems={sidebarItems}
          />
        </div>
        <Footer socialMedia={socialMedia} />
      </div>
    </Router>
  );
}

export default App;