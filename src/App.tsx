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
  X,
  Search,
  User,
  LogOut,
  HelpCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ErrorBoundary from "./components/common/ErrorBoundary";

// Lazy-loaded components (same as original)
//const Dashboard = lazy(() => import("./components/Dashboard"));
const RegisterCitizen = lazy(() => import("./components/RegisterCitizen"));
const RegisterForeign = lazy(() => import("./components/RegisterForeign"));
const MarriageRegistration = lazy(() => import("./components/MarriageRegistration"));
const BirthRegistration = lazy(() => import("./components/BirthRegistration"));
const DivorceRegistration = lazy(() => import("./components/DivorceRegistration"));
const DeathRegistration = lazy(() => import("./components/DeathRegistration"));
const CitizenSearch = lazy(() => import("./components/CitizenSearch"));
const Reports = lazy(() => import("./components/Reports"));
const SettingsComponent = lazy(() => import("./components/SettingsComponent"));
const IssuePassport = lazy(() => import("./components/IssuePassport"));
const TravelDocument = lazy(() => import("./components/TravelDocument"));
const AddChildToPassport = lazy(() => import("./components/AddChildToPassport"));
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
const LoginPage = lazy(() => import("./components/LoginPage"));
const SignupPage = lazy(() => import("./components/SignupPage"));

// Enhanced LoadingScreen component with animation
const LoadingScreen = () => (
  <div className="flex items-center justify-center w-full h-full bg-gray-50 dark:bg-gray-900">
    <motion.div
      className="p-8 rounded-lg shadow-lg bg-white dark:bg-gray-800"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center">
        <motion.div
          className="w-16 h-16 mb-4 border-4 border-red-800 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="text-lg font-semibold text-red-800 dark:text-red-500">جاري التحميل...</p>
      </div>
    </motion.div>
  </div>
);

interface ThemeToggleProps {
  theme: string;
  toggleTheme: () => void;
}

// Enhanced ThemeToggle with animation
const ThemeToggle = memo(({ theme, toggleTheme }: ThemeToggleProps) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    onClick={toggleTheme}
    className="p-2 rounded-full hover:bg-red-700/20 dark:hover:bg-red-900/20"
    aria-label="Toggle theme"
  >
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={theme}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {theme === "dark" ? (
          <Sun className="text-yellow-400" />
        ) : (
          <Moon className="text-blue-900" />
        )}
      </motion.div>
    </AnimatePresence>
  </motion.button>
));

// Update the SocialMediaLinks component as well
interface SocialMediaLinksProps {
  socialMedia: SocialMediaItem[];
}

const SocialMediaLinks = memo(({ socialMedia }: SocialMediaLinksProps) => (
  <div className="flex items-center space-x-4">
    {socialMedia.map((social) => (
      <motion.a
        key={social.key}
        href={social.link}
        className="text-white hover:text-gray-300 transition-colors"
        aria-label={social.label}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
      >
        {social.icon}
      </motion.a>
    ))}
  </div>
));

// Enhanced Notification component
interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPanel = ({ isOpen, onClose }: NotificationPanelProps) => {
  const notifications = [
    { id: 1, message: "تم إكمال طلب جواز جديد", time: "منذ 5 دقائق", read: false },
    { id: 2, message: "تم تحديث بيانات المواطن", time: "منذ ساعة", read: false },
    { id: 3, message: "تم رفض طلب تأشيرة", time: "منذ 3 ساعات", read: true },
    { id: 4, message: "صيانة النظام مجدولة الليلة", time: "منذ يوم", read: true },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute left-4 top-16 w-80 bg-white dark:bg-gray-800 shadow-xl rounded-lg z-50 overflow-hidden"
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <X size={18} />
            </button>
            <h3 className="font-semibold text-lg text-gray-800 dark:text-white">الإشعارات</h3>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-b border-gray-100 dark:border-gray-700 text-right ${
                    notification.read ? "bg-white dark:bg-gray-800" : "bg-blue-50 dark:bg-blue-900/20"
                  } hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors`}
                >
                  <p className="text-sm text-gray-800 dark:text-gray-200">{notification.message}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                لا توجد إشعارات جديدة
              </div>
            )}
          </div>
          <div className="p-2 text-center border-t border-gray-200 dark:border-gray-700">
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
              تحديد الكل كمقروء
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Enhanced User Menu component
interface UserMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

// Extract menu item click handler to reduce nesting
const handleMenuItemClick = (action: () => void, onClose: () => void) => {
  action();
  onClose();
};

// Enhanced UserMenu with accessibility improvements
const UserMenu = ({ isOpen, onClose }: UserMenuProps) => {
  const navigate = useNavigate();
  
  const menuItems = [
    { id: 'profile', icon: <User size={16} />, label: "الملف الشخصي", action: () => navigate("/profile") },
    { id: 'settings', icon: <Settings size={16} />, label: "الإعدادات", action: () => navigate("/settings") },
    { id: 'help', icon: <HelpCircle size={16} />, label: "المساعدة", action: () => navigate("/help") },
    { id: 'logout', icon: <LogOut size={16} />, label: "تسجيل الخروج", action: () => navigate("/logout") },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute right-4 top-16 w-56 bg-white dark:bg-gray-800 shadow-xl rounded-lg z-50 overflow-hidden"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu"
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 text-right">
            <h3 className="font-semibold text-gray-800 dark:text-white">محمد أحمد</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">مسؤول النظام</p>
          </div>
          <div className="py-2">
            {menuItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex justify-end items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleMenuItemClick(item.action, onClose)}
                role="menuitem"
                tabIndex={0}
                aria-label={item.label}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleMenuItemClick(item.action, onClose);
                  }
                }}
              >
                <span className="ms-3">{item.label}</span>
                {item.icon}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Define the props interface for the Topbar component
interface TopbarProps {
  theme: string;
  toggleTheme: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Enhanced Topbar
const Topbar = memo(({ theme, toggleTheme, isSidebarOpen, setIsSidebarOpen }: TopbarProps) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <div className="bg-gradient-to-r from-red-800 to-red-900 dark:from-red-950 dark:to-red-900 text-white shadow-md p-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-white lg:hidden"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="Toggle sidebar"
        >
          <Menu />
        </motion.button>
        
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative"
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setUserMenuOpen(false);
            }}
          >
            <Bell />
            <span className="absolute -top-1 -right-1 bg-yellow-500 text-xs rounded-full w-4 h-4 flex items-center justify-center">2</span>
          </motion.button>
          <NotificationPanel 
            isOpen={notificationsOpen} 
            onClose={() => setNotificationsOpen(false)} 
          />
        </div>
        
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        
        <div className={`relative rounded-full transition-all duration-300 ${
          searchFocused ? "bg-white w-64" : "bg-white/20 w-40 hover:bg-white/30"
        }`}>
          <input
            className={`w-full py-1.5 px-4 pr-10 rounded-full focus:outline-none ${
              searchFocused ? "text-gray-800" : "bg-transparent text-white placeholder-white/70"
            }`}
            placeholder="بحث..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
            searchFocused ? "text-gray-500" : "text-white/70"
          }`} size={16} />
        </div>
      </div>
      
      <motion.h3 
        className="text-xl font-bold text-center hidden md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        وزارة الخارجية الليبية
      </motion.h3>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => {
              setUserMenuOpen(!userMenuOpen);
              setNotificationsOpen(false);
            }}
          >
            <div className="flex flex-col items-end p-2">
              <span className="font-semibold text-sm pr-4 text-white">
                محمد أحمد
              </span>
              <span className="text-xs text-gray-200 dark:text-gray-300 pr-4">
                مسؤول
              </span>
            </div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-2 border-white"
            >
              <User className="text-white" size={20} />
            </motion.div>
          </div>
          <UserMenu 
            isOpen={userMenuOpen} 
            onClose={() => setUserMenuOpen(false)} 
          />
        </div>
      </div>
    </div>
  );
});

// Enhanced Footer
// Define the interface for the social media items
interface SocialMediaItem {
  key: number;
  icon: React.ReactNode;
  link: string;
  label: string;
}

// Define the props interface for the Footer component
interface FooterProps {
  socialMedia: SocialMediaItem[];
}

// Update your Footer component to use the props interface
const Footer = memo(({ socialMedia }: FooterProps) => (
  <footer className="shadow-md p-4 text-right bg-gradient-to-r from-emerald-900 to-emerald-800 dark:from-emerald-950 dark:to-emerald-900 text-white">
    <div className="flex justify-between items-center">
      <SocialMediaLinks socialMedia={socialMedia} />
      <div className="text-sm text-white">
        © 2024 لوحة المعلومات. جميع الحقوق محفوظة
      </div>
      <div className="space-x-4 space-x-reverse">
        <motion.a 
          whileHover={{ y: -2 }}
          href="#" 
          className="text-sm text-white hover:text-gray-300"
        >
          سياسة الخصوصية
        </motion.a>
        <motion.a 
          whileHover={{ y: -2 }}
          href="#" 
          className="text-sm text-white hover:text-gray-300"
        >
          شروط الاستخدام
        </motion.a>
      </div>
    </div>
  </footer>
));

// Define the props interface for the Sidebar component
interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarItems: SidebarItem[];
}

interface SubItem {
  key: number;
  icon: React.ReactNode;
  label: string;
  path?: string;
}

interface SidebarItem {
  key: number;
  icon: React.ReactNode;
  label: string;
  path?: string;
  subItems?: SubItem[];
}

// Extract sidebar item click handler to reduce nesting
const handleSidebarItemClick = (item: SidebarItem, activeSubmenu: number | null, setActiveSubmenu: React.Dispatch<React.SetStateAction<number | null>>, navigate: (path: string) => void) => {
  if (item.subItems) {
    setActiveSubmenu(activeSubmenu === item.key ? null : item.key);
  } else if (item.path) {
    navigate(item.path);
  }
};

// Extract sidebar sub-item click handler to reduce nesting
const handleSubItemClick = (path: string | undefined, navigate: (path: string) => void) => {
  if (path) {
    navigate(path);
  }
};

// Enhanced Sidebar with animations
const Sidebar = memo(({ isSidebarOpen, setIsSidebarOpen, sidebarItems }: SidebarProps) => {
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const activeItem: SidebarItem | undefined = sidebarItems.find((item: SidebarItem) =>
      item.subItems?.some((sub: SubItem) => sub.path === currentPath)
    );
    if (activeItem) setActiveSubmenu(activeItem.key);
  }, [currentPath, sidebarItems]);

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarOpen(!isSidebarOpen);
  }, [isSidebarOpen, setIsSidebarOpen]);

  const sidebarVariants = {
    open: { width: 240, transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: { width: 80, transition: { type: "spring", stiffness: 300, damping: 30 } }
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 shadow-lg flex flex-col border-l border-gray-200 dark:border-gray-700 z-20"
      variants={sidebarVariants}
      initial={isSidebarOpen ? "open" : "closed"}
      animate={isSidebarOpen ? "open" : "closed"}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleToggleSidebar}
          className="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Toggle sidebar"
        >
          <Menu />
        </motion.button>
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-xl font-bold text-gray-900 dark:text-white"
            >
              لوحة المعلومات
            </motion.h2>
          )}
        </AnimatePresence>
      </div>
      <nav className="py-4 flex-1 text-gray-900 dark:text-white overflow-y-auto">
        {sidebarItems.map((item) => {
          const isActive = item.subItems
            ? item.subItems.some((sub: SubItem) => sub.path === currentPath)
            : item.path === currentPath;

          return (
            <div key={item.key}>
              <div
                className={`flex items-center justify-end p-3 cursor-pointer ${
                  isActive
                    ? "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-r-4 border-red-800 dark:border-red-600"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                } transition-transform hover:translate-x-[-4px]`}
                onClick={() => handleSidebarItemClick(item, activeSubmenu, setActiveSubmenu, navigate)}
              >
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="ml-3"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                <span className={`${isSidebarOpen ? "mr-3" : "mx-auto"} ${isActive ? "text-red-800 dark:text-red-400" : ""}`}>
                  {item.icon}
                </span>
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
              <AnimatePresence>
                {isSidebarOpen && item.subItems && activeSubmenu === item.key && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-gray-50 dark:bg-gray-700/50 overflow-hidden"
                  >
                    {item.subItems.map((subItem: SubItem) => (
                      <div
                        key={subItem.key}
                        className={`flex items-center justify-end p-3 pr-8 cursor-pointer ${
                          subItem.path === currentPath
                          ? "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-r-2 border-red-800 dark:border-red-600"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        } transition-transform hover:translate-x-[-4px]`}
                        onClick={() => handleSubItemClick(subItem.path, navigate)}
                      >
                        <span className="ml-3">{subItem.label}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>
    </motion.div>
  );
});

// Main App component with enhanced state management
function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState("dark");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const initialTheme = savedTheme
      ? savedTheme
      : window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
    
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
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
        {
          key: 11,
          icon: <></>,
          label: "تسجيل مواطن",
          path: "/civil-registry/register-citizen",
        },
        {
          key: 12,
          icon: <></>,
          label: "تسجيل أجنبي",
          path: "/civil-registry/register-foreign",
        },
        {
          key: 13,
          icon: <></>,
          label: "تسجيل واقعة الزواج",
          path: "/civil-registry/marriage",
        },
        {
          key: 14,
          icon: <></>,
          label: "تسجيل واقعة الولادة",
          path: "/civil-registry/birth",
        },
        {
          key: 15,
          icon: <></>,
          label: "تسجيل واقعة الطلاق",
          path: "/civil-registry/divorce",
        },
        {
          key: 16,
          icon: <></>,
          label: "تسجيل واقعة الوفاة",
          path: "/civil-registry/death",
        },
        {
          key: 17,
          icon: <></>,
          label: "بحث عن مواطن",
          path: "/civil-registry/citizen-search",
        },
      ],
    },
    {
      key: 2,
      icon: <FileArchive />,
      label: "الجوازات",
      subItems: [
        {
          key: 21,
          icon: <></>,
          label: "اصدار جواز",
          path: "/passports/issue-passport",
        },
        {
          key: 22,
          icon: <></>,
          label: "اصدار وثيقة سفر",
          path: "/passports/travel-document",
        },
        {
          key: 23,
          icon: <></>,
          label: "أضافة طفل لجواز",
          path: "/passports/add-child",
        },
        {
          key: 24,
          icon: <></>,
          label: "الطلبات المكتملة",
          path: "/passports/completed-requests",
        },
      ],
    },
    {
      key: 3,
      icon: <FileCheck />,
      label: "التأشيرات",
      subItems: [
        { key: 31, icon: <></>, label: "طلب جديد", path: "/visas/new-request" },
        {
          key: 32,
          icon: <></>,
          label: "الطلبات المعلقة",
          path: "/visas/pending-requests",
        },
        {
          key: 33,
          icon: <></>,
          label: "الطلبات المكتملة",
          path: "/visas/completed-requests",
        },
      ],
    },
    {
      key: 4,
      icon: <FileText />,
      label: "التصديقات",
      subItems: [
        {
          key: 41,
          icon: <></>,
          label: "تصديق محلي",
          path: "/attestations/local",
        },
        {
          key: 42,
          icon: <></>,
          label: "تصديق دولي",
          path: "/attestations/international",
        },
      ],
    },
    {
      key: 5,
      icon: <Handshake />,
      label: "التوكيلات",
      subItems: [
        {
          key: 51,
          icon: <></>,
          label: "توكيل للمحاكم",
          path: "/proxies/court",
        },
        { key: 52, icon: <></>, label: "توكيل مصرفي", path: "/proxies/bank" },
        { key: 53, icon: <></>, label: "توكيل طلاق", path: "/proxies/divorce" },
        {
          key: 54,
          icon: <></>,
          label: "توكيل عقاري",
          path: "/proxies/real-estate",
        },
        {
          key: 55,
          icon: <></>,
          label: "توكيل الفريضة الشرعية",
          path: "/proxies/inheritance",
        },
        {
          key: 56,
          icon: <></>,
          label: "توكيل إتمام مستندات",
          path: "/proxies/document-completion",
        },
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

  // If loading, show loading screen
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <div className={`flex flex-col h-dvh font-sans ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"}`}>
        <Routes>
          {/* Public routes (login/signup) */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Protected routes with layout */}
          <Route path="/*" element={
            <>
              <Topbar
                theme={theme}
                toggleTheme={toggleTheme}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
              />
              <div className="flex-1 flex bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={location.pathname}
                    className="flex-1 overflow-y-auto p-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Suspense fallback={<LoadingScreen />}>
                      <ErrorBoundary>
                        <Routes>
                          {/* Dashboard route */}
                          <Route path="dashboard" element={<DashboardPlaceholder />} />

                          {/* Civil Registry routes */}
                          <Route path="civil-registry/register-citizen" element={<RegisterCitizen />} />
                          <Route path="civil-registry/register-foreign" element={<RegisterForeign />} />
                          <Route path="civil-registry/marriage" element={<MarriageRegistration />} />
                          <Route path="civil-registry/birth" element={<BirthRegistration />} />
                          <Route path="civil-registry/divorce" element={<DivorceRegistration />} />
                          <Route path="civil-registry/death" element={<DeathRegistration />} />
                          <Route path="civil-registry/citizen-search" element={<CitizenSearch />} />
                          
                          {/* Reports and Settings routes */}
                          <Route path="reports" element={<Reports />} />
                          <Route path="settings" element={<SettingsComponent />} />
                          
                          {/* Passport routes */}
                          <Route path="passports/issue-passport" element={<IssuePassport />} />
                          <Route path="passports/travel-document" element={<TravelDocument />} />
                          <Route path="passports/add-child" element={<AddChildToPassport />} />
                          <Route path="passports/completed-requests" element={<CompletedRequestsPassports />} />
                          
                          {/* Visa routes */}
                          <Route path="visas/new-request" element={<NewRequestVisas />} />
                          <Route path="visas/pending-requests" element={<PendingRequestsVisas />} />
                          <Route path="visas/completed-requests" element={<CompletedRequestsVisas />} />
                          
                          {/* Attestation routes */}
                          <Route path="attestations/local" element={<LocalAttestation />} />
                          <Route path="attestations/international" element={<InternationalAttestation />} />
                          
                          {/* Proxy routes */}
                          <Route path="proxies/court" element={<CourtProxy />} />
                          <Route path="proxies/bank" element={<BankProxy />} />
                          <Route path="proxies/divorce" element={<DivorceProxy />} />
                          <Route path="proxies/real-estate" element={<RealEstateProxy />} />
                          <Route path="proxies/inheritance" element={<InheritanceProxy />} />
                          <Route path="proxies/document-completion" element={<DocumentCompletionProxy />} />
                          <Route path="proxies/general" element={<GeneralProxy />} />
                        </Routes>
                      </ErrorBoundary>
                    </Suspense>
                  </motion.div>
                </AnimatePresence>
                <Sidebar
                  isSidebarOpen={isSidebarOpen}
                  setIsSidebarOpen={setIsSidebarOpen}
                  sidebarItems={sidebarItems}
                />
              </div>
              <Footer socialMedia={socialMedia} />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

// Helper function to render stat cards
const renderStatCard = (stat: { title: string, value: string, icon: React.ReactNode, change: string, color: string, id: string }, index: number) => (
  <motion.div
    key={stat.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ 
      y: -5, 
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" 
    }}
    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{stat.title}</p>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
        <p className={`text-sm mt-2 ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
          {stat.change} من الشهر السابق
        </p>
      </div>
      <div className={`p-3 rounded-full ${stat.color} bg-opacity-20 dark:bg-opacity-30`}>
        {stat.icon}
      </div>
    </div>
  </motion.div>
);

// Helper function to render activity item
const renderActivityItem = (activity: { id: number, action: string, user: string, time: string }) => (
  <div 
    key={activity.id}
    className="p-3 border-b border-gray-100 dark:border-gray-700 text-right transition-transform hover:-translate-x-1"
  >
    <p className="font-medium text-gray-800 dark:text-white">{activity.action}</p>
    <div className="flex justify-end items-center mt-1">
      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{activity.time}</span>
      <span className="text-sm text-gray-600 dark:text-gray-300">{activity.user}</span>
    </div>
  </div>
);

// Helper function to render quick access item
const renderQuickAccessItem = (item: { icon: React.ReactNode, label: string, path: string, id?: string }, index: number) => (
  <div
    key={item.path || `quick-access-${index}`} // Use path as key if available, fallback to index with prefix
    className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:-translate-y-1 transition-transform hover:shadow-md"
  >
    <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 mb-3">
      {item.icon}
    </div>
    <p className="text-sm text-center text-gray-800 dark:text-white">{item.label}</p>
  </div>
);

// Enhanced Dashboard placeholder component with modern UI widgets
const DashboardPlaceholder = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Sample stats data
  const stats = [
    { title: "إجمالي المواطنين", value: "12,843", icon: <User />, change: "+12%", color: "bg-blue-500", id: "1" },
    { title: "طلبات الجوازات", value: "683", icon: <FileArchive />, change: "+5%", color: "bg-green-500", id: "2" },
    { title: "طلبات التأشيرات", value: "247", icon: <FileCheck />, change: "-3%", color: "bg-yellow-500", id: "3" },
    { title: "قيد المعالجة", value: "129", icon: <FileText />, change: "+2%", color: "bg-red-500", id: "4" },
  ];
  
  // Sample recent activities
  const recentActivities = [
    { id: 1, action: "تسجيل مواطن جديد", user: "أحمد محمد", time: "منذ 10 دقائق" },
    { id: 2, action: "إصدار جواز سفر", user: "فاطمة علي", time: "منذ 45 دقائق" },
    { id: 3, action: "تسجيل واقعة زواج", user: "عمر حسن", time: "منذ ساعة" },
    { id: 4, action: "طلب تأشيرة جديد", user: "ليلى أحمد", time: "منذ 3 ساعات" },
    { id: 5, action: "تصديق دولي", user: "محمد علي", time: "منذ 5 ساعات" },
  ];

  const quickAccessItems = [
    { icon: <Book />, label: "تسجيل مواطن", path: "/civil-registry/register-citizen" },
    { icon: <FileArchive />, label: "إصدار جواز", path: "/passports/issue-passport" },
    { icon: <FileCheck />, label: "طلب تأشيرة", path: "/visas/new-request" },
    { icon: <FileText />, label: "تصديق محلي", path: "/attestations/local" },
    { icon: <BarChart2 />, label: "التقارير", path: "/reports" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <button 
            className={`px-4 py-2 rounded-lg ${activeTab === 'overview' 
              ? 'bg-red-800 text-white' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            onClick={() => setActiveTab('overview')}
          >
            نظرة عامة
          </button>
          <button 
            className={`px-4 py-2 rounded-lg ${activeTab === 'statistics' 
              ? 'bg-red-800 text-white' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            onClick={() => setActiveTab('statistics')}
          >
            الإحصائيات
          </button>
          <button 
            className={`px-4 py-2 rounded-lg ${activeTab === 'reports' 
              ? 'bg-red-800 text-white' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            onClick={() => setActiveTab('reports')}
          >
            التقارير
          </button>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">لوحة التحكم</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => renderStatCard(stat, index))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart placeholder */}
        <motion.div 
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex justify-between items-center mb-6">
            <div className="space-x-2 space-x-reverse">
              <button className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">اليوم</button>
              <button className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">أسبوع</button>
              <button className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">شهر</button>
              <button className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">سنة</button>
            </div>
            <h2 className="font-bold text-lg text-gray-800 dark:text-white">تقرير النشاط</h2>
          </div>
          <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">رسم بياني للإحصائيات</p>
          </div>
        </motion.div>

        {/* Recent activity */}
        <motion.div 
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <button className="text-red-800 dark:text-red-400 text-sm font-medium">عرض الكل</button>
            <h2 className="font-bold text-lg text-gray-800 dark:text-white">النشاطات الأخيرة</h2>
          </div>
          <div className="space-y-4">
            {recentActivities.map(activity => renderActivityItem(activity))}
          </div>
        </motion.div>
      </div>

      {/* Quick Access */}
      <motion.div 
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex justify-between items-center mb-6">
          <span></span>
          <h2 className="font-bold text-lg text-gray-800 dark:text-white">الوصول السريع</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {quickAccessItems.map((item, index) => renderQuickAccessItem(item, index))}
        </div>
      </motion.div>
    </div>
  );
};

export default App;