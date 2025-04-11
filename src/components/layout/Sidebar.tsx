import { useState, useEffect, useCallback, memo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, ChevronUp, ChevronDown } from "lucide-react";
import { SidebarProps, SidebarItem, SubItem } from "../../types/sidebar.types";

// Enhanced Sidebar without animations or transforms
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

  return (
    <div
      className={`bg-white dark:bg-gray-800 shadow-lg flex flex-col border-l border-gray-200 dark:border-gray-700 z-20 transition-all duration-300 ${
        isSidebarOpen ? "w-60" : "w-20"
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
        {isSidebarOpen && (
          <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-opacity">
            لوحة المعلومات
          </h2>
        )}
      </div>
      <nav className="py-4 flex-1 text-gray-900 dark:text-white overflow-y-auto">
        {sidebarItems.map((item) => {
          const isActive = item.subItems
            ? item.subItems.some((sub: SubItem) => sub.path === currentPath)
            : item.path === currentPath;

          return (
            <div key={item.key}>
              <div
                className={`flex items-center justify-end p-3 cursor-pointer transition-colors ${
                  isActive
                    ? "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-r-4 border-red-800 dark:border-red-600"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={() => {
                  if (item.subItems) {
                    setActiveSubmenu(activeSubmenu === item.key ? null : item.key);
                  } else if (item.path) {
                    navigate(item.path);
                  }
                }}
              >
                {isSidebarOpen && (
                  <span className="ml-3 transition-opacity">
                    {item.label}
                  </span>
                )}
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
              {isSidebarOpen && item.subItems && activeSubmenu === item.key && (
                <div
                  className="bg-gray-50 dark:bg-gray-700/50 overflow-hidden"
                >
                  {item.subItems.map((subItem: SubItem) => (
                    <div
                      key={subItem.key}
                      className={`flex items-center justify-end p-3 pr-8 cursor-pointer ${
                        subItem.path === currentPath
                          ? "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-r-2 border-red-800 dark:border-red-600"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
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

export default Sidebar;