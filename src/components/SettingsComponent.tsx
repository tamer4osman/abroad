import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Moon,
  Sun,
  Globe,
  Lock,
  User,
  Save,
  Building,
  AlertTriangle,
  Bell,
  ChevronDown,
  Trash2,
  RefreshCw
} from 'lucide-react';
import Embassies from './Embassies';
import Section from './common/Section';

interface SettingsTabProps {
  active: string;
  setActive: (tab: string) => void;
}

// Settings Tab Navigation component
const SettingsTabs: React.FC<SettingsTabProps> = ({ active, setActive }) => {
  const tabs = [
    { id: 'interface', label: 'واجهة المستخدم', icon: <Moon size={18} /> },
    { id: 'profile', label: 'الملف الشخصي', icon: <User size={18} /> },
    { id: 'security', label: 'الأمان', icon: <Lock size={18} /> },
    { id: 'embassies', label: 'السفارات', icon: <Building size={18} /> },
    { id: 'system', label: 'إعدادات النظام', icon: <AlertTriangle size={18} /> },
    { id: 'notifications', label: 'الإشعارات', icon: <Bell size={18} /> }
  ];

  return (
    <div className="flex overflow-x-auto mb-6 pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActive(tab.id)}
          className={`flex items-center px-4 py-2 mx-1 whitespace-nowrap rounded-lg ${
            active === tab.id
              ? 'bg-red-800 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <span className="ml-2">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
};

// Input field component specifically for settings
const SettingsField: React.FC<{
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}> = ({ label, id, type = 'text', value, onChange, disabled = false }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-red-500 focus:border-red-500 ${
        disabled ? 'opacity-60 cursor-not-allowed' : ''
      }`}
    />
  </div>
);

// Props for the Toggle component
interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  id?: string;
}

// Enhanced Toggle component with proper accessibility
const Toggle = ({ checked, onChange, disabled = false, label, id }: ToggleProps) => {
  return (
    <div className="flex items-center justify-between">
      {label && <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>}
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        id={id}
        disabled={disabled}
        className={`${
          checked ? 'bg-red-800 dark:bg-red-700' : 'bg-gray-200 dark:bg-gray-600'
        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
        onClick={() => !disabled && onChange(!checked)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!disabled) onChange(!checked);
          }
        }}
        tabIndex={disabled ? -1 : 0}
      >
        <span
          className={`${
            checked ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
        />
      </button>
    </div>
  );
};

// Select component for dropdown settings
const SettingsSelect: React.FC<{
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
}> = ({ label, id, value, onChange, options, disabled = false }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}
    </label>
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full py-2 px-3 border rounded-md appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-red-500 focus:border-red-500 ${
          disabled ? 'opacity-60 cursor-not-allowed' : ''
        }`}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
        <ChevronDown size={16} />
      </div>
    </div>
  </div>
);

// Actions row component for settings
const ActionRow: React.FC<{
  label: string;
  buttonText: string;
  onClick: () => void;
  buttonType?: 'primary' | 'danger' | 'warning';
  icon?: React.ReactNode;
  description?: string;
}> = ({ label, buttonText, onClick, buttonType = 'primary', icon, description }) => {
  const buttonClasses = {
    primary: 'bg-red-800 hover:bg-red-700 text-white',
    danger: 'bg-red-600 hover:bg-red-500 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-400 text-white'
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 py-4 last:border-b-0">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</h3>
          {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>}
        </div>
        <button
          onClick={onClick}
          className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${buttonClasses[buttonType]}`}
        >
          {icon && <span className="ml-2">{icon}</span>}
          {buttonText}
        </button>
      </div>
    </div>
  );
};

// Main Settings Component
const SettingsComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('interface');
  
  // Interface settings state
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });
  const [language, setLanguage] = useState('ar');
  const [rtlEnabled, setRtlEnabled] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  
  // Profile settings state
  const [name, setName] = useState('محمد أحمد');
  const [email, setEmail] = useState('mohammed@example.com');
  const [phoneNumber, setPhoneNumber] = useState('+218123456789');
  const [role, setRole] = useState('مسؤول النظام');
  
  // Security settings state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const passwordLastChanged = '2025-01-15';
  
  // System settings state
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [cacheLifetime, setCacheLifetime] = useState('60');
  
  // Notification settings state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [systemNotifications, setSystemNotifications] = useState(true);
  
  const handleThemeChange = useCallback((newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  }, []);
  
  const handleLanguageChange = useCallback((newLanguage: string) => {
    setLanguage(newLanguage);
    // In a real app, this would actually change the application language
    // through i18n context or other localization library
    console.log(`Language would change to: ${newLanguage}`);
  }, []);

  const handleSaveSettings = useCallback(() => {
    // In a real app, this would persist settings to backend
    console.log('Settings saved');
    
    // Show success message (would use a toast library in real app)
    alert('تم حفظ الإعدادات بنجاح');
  }, []);
  
  const handleClearCache = useCallback(() => {
    // In a real app, this would clear application cache
    console.log('Cache cleared');
    
    // Show success message
    alert('تم مسح ذاكرة التخزين المؤقت بنجاح');
  }, []);
  
  const handleResetSettings = useCallback(() => {
    // Confirm before resetting
    if (window.confirm('هل أنت متأكد أنك تريد إعادة تعيين جميع الإعدادات إلى الوضع الافتراضي؟')) {
      // Reset to defaults
      setTheme('light');
      setLanguage('ar');
      setRtlEnabled(true);
      setHighContrast(false);
      setAnimationsEnabled(true);
      setTwoFactorEnabled(false);
      setSessionTimeout('30');
      setMaintenanceMode(false);
      setDebugMode(false);
      setCacheLifetime('60');
      setEmailNotifications(true);
      setSmsNotifications(false);
      setSystemNotifications(true);
      
      // Update theme in DOM
      document.documentElement.classList.toggle('dark', false);
      localStorage.setItem('theme', 'light');
      
      // Show success message
      alert('تم إعادة تعيين الإعدادات بنجاح');
    }
  }, []);
  
  // Interface Settings Tab
  const interfaceSettingsTab = useMemo(() => (
    <div>
      <Section title="إعدادات المظهر">
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            سمة التطبيق
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleThemeChange('light')}
              className={`p-4 border rounded-lg flex flex-col items-center ${
                theme === 'light'
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <Sun size={24} className="text-yellow-500 mb-2" />
              <span className="text-sm">فاتح</span>
            </button>
            
            <button
              onClick={() => handleThemeChange('dark')}
              className={`p-4 border rounded-lg flex flex-col items-center ${
                theme === 'dark'
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <Moon size={24} className="text-blue-700 dark:text-blue-400 mb-2" />
              <span className="text-sm">داكن</span>
            </button>
          </div>
        </div>
        
        <SettingsSelect
          label="اللغة"
          id="language"
          value={language}
          onChange={handleLanguageChange}
          options={[
            { value: 'ar', label: 'العربية' },
            { value: 'en', label: 'English' }
          ]}
        />
        
        <Toggle 
          label="تفعيل الكتابة من اليمين إلى اليسار (RTL)"
          id="rtl-toggle"
          checked={rtlEnabled}
          onChange={setRtlEnabled}
        />
        
        <Toggle 
          label="وضع التباين العالي"
          id="contrast-toggle"
          checked={highContrast}
          onChange={setHighContrast}
        />
        
        <Toggle 
          label="تفعيل التحريكات (Animations)"
          id="animations-toggle"
          checked={animationsEnabled}
          onChange={setAnimationsEnabled}
        />
      </Section>
      
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSaveSettings}
          className="px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-700 flex items-center"
        >
          <Save size={18} className="ml-2" />
          حفظ الإعدادات
        </button>
      </div>
    </div>
  ), [theme, language, rtlEnabled, highContrast, animationsEnabled, handleThemeChange, handleLanguageChange, handleSaveSettings]);
  
  // Profile Settings Tab
  const profileSettingsTab = useMemo(() => (
    <div>
      <Section title="المعلومات الشخصية">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center overflow-hidden border-4 border-white dark:border-gray-800 shadow-md">
              <User size={48} className="text-gray-600 dark:text-gray-400" />
            </div>
            <button className="absolute bottom-0 right-0 bg-red-800 text-white p-2 rounded-full hover:bg-red-700">
              <Globe size={18} />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SettingsField
            label="الاسم الكامل"
            id="fullName"
            value={name}
            onChange={setName}
          />
          
          <SettingsField
            label="البريد الإلكتروني"
            id="email"
            type="email"
            value={email}
            onChange={setEmail}
          />
          
          <SettingsField
            label="رقم الهاتف"
            id="phone"
            type="tel"
            value={phoneNumber}
            onChange={setPhoneNumber}
          />
          
          <SettingsField
            label="الدور الوظيفي"
            id="role"
            value={role}
            onChange={setRole}
            disabled={true}
          />
        </div>
      </Section>
      
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSaveSettings}
          className="px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-700 flex items-center"
        >
          <Save size={18} className="ml-2" />
          حفظ البيانات
        </button>
      </div>
    </div>
  ), [name, email, phoneNumber, role, handleSaveSettings]);
  
  // Security Settings Tab
  const securitySettingsTab = useMemo(() => (
    <div>
      <Section title="إعدادات الأمان">
        <Toggle 
          label="تفعيل المصادقة الثنائية (2FA)"
          id="2fa-toggle"
          checked={twoFactorEnabled}
          onChange={setTwoFactorEnabled}
        />
        
        <SettingsSelect
          label="مدة انتهاء الجلسة (بالدقائق)"
          id="session-timeout"
          value={sessionTimeout}
          onChange={setSessionTimeout}
          options={[
            { value: '15', label: '15 دقيقة' },
            { value: '30', label: '30 دقيقة' },
            { value: '60', label: 'ساعة واحدة' },
            { value: '120', label: 'ساعتان' }
          ]}
        />
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            آخر تغيير لكلمة المرور
          </label>
          <div className="px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400">
            {passwordLastChanged}
          </div>
        </div>
        
        <ActionRow
          label="تغيير كلمة المرور"
          buttonText="تغيير"
          onClick={() => alert('سيتم فتح نافذة لتغيير كلمة المرور')}
          buttonType="primary"
          icon={<Lock size={16} />}
          description="يُنصح بتغيير كلمة المرور كل 90 يومًا"
        />
        
        <ActionRow
          label="تسجيل الخروج من جميع الأجهزة"
          buttonText="تسجيل الخروج"
          onClick={() => {
            if (window.confirm('هل أنت متأكد من رغبتك في تسجيل الخروج من جميع الأجهزة؟')) {
              alert('تم تسجيل الخروج من جميع الأجهزة');
            }
          }}
          buttonType="warning"
          icon={<RefreshCw size={16} />}
          description="سيؤدي هذا إلى تسجيل خروجك من جميع الجلسات النشطة على كافة الأجهزة"
        />
      </Section>
    </div>
  ), [twoFactorEnabled, sessionTimeout, passwordLastChanged]);
  
  // Embassy Settings Tab
  const embassySettingsTab = useMemo(() => (
    <div>
      <Section title="إعدادات السفارات">
        <Embassies />
      </Section>
    </div>
  ), []);
  
  // System Settings Tab
  const systemSettingsTab = useMemo(() => (
    <div>
      <Section title="إعدادات النظام">
        <Toggle 
          label="وضع الصيانة"
          id="maintenance-mode-toggle"
          checked={maintenanceMode}
          onChange={setMaintenanceMode}
        />
        
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 -mt-1">
          عند تفعيل وضع الصيانة، سيتم منع وصول المستخدمين إلى النظام باستثناء المسؤولين
        </p>
        
        <Toggle 
          label="وضع التصحيح (Debug Mode)"
          id="debug-mode-toggle"
          checked={debugMode}
          onChange={setDebugMode}
        />
        
        <SettingsSelect
          label="مدة صلاحية ذاكرة التخزين المؤقت (بالدقائق)"
          id="cache-lifetime"
          value={cacheLifetime}
          onChange={setCacheLifetime}
          options={[
            { value: '15', label: '15 دقيقة' },
            { value: '30', label: '30 دقيقة' },
            { value: '60', label: 'ساعة واحدة' },
            { value: '1440', label: 'يوم كامل' }
          ]}
        />
        
        <ActionRow
          label="مسح ذاكرة التخزين المؤقت"
          buttonText="مسح"
          onClick={handleClearCache}
          buttonType="warning"
          icon={<RefreshCw size={16} />}
          description="سيؤدي هذا إلى إعادة تحميل جميع البيانات من المصدر"
        />
        
        <ActionRow
          label="إعادة تعيين جميع الإعدادات"
          buttonText="إعادة تعيين"
          onClick={handleResetSettings}
          buttonType="danger"
          icon={<Trash2 size={16} />}
          description="سيؤدي هذا إلى إعادة جميع إعدادات النظام إلى وضعها الافتراضي"
        />
      </Section>
    </div>
  ), [maintenanceMode, debugMode, cacheLifetime, handleClearCache, handleResetSettings]);
  
  // Notification Settings Tab
  const notificationSettingsTab = useMemo(() => (
    <div>
      <Section title="إعدادات الإشعارات">
        <Toggle 
          label="إشعارات البريد الإلكتروني"
          id="email-notifications-toggle"
          checked={emailNotifications}
          onChange={setEmailNotifications}
        />
        
        <Toggle 
          label="إشعارات الرسائل القصيرة (SMS)"
          id="sms-notifications-toggle"
          checked={smsNotifications}
          onChange={setSmsNotifications}
        />
        
        <Toggle 
          label="إشعارات النظام"
          id="system-notifications-toggle"
          checked={systemNotifications}
          onChange={setSystemNotifications}
        />
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            نوع الإشعارات
          </label>
          <div className="space-y-2">
            {[
              { id: 'notification-login', label: 'تسجيل الدخول' },
              { id: 'notification-documents', label: 'المستندات الجديدة' },
              { id: 'notification-approvals', label: 'طلبات الموافقة' },
              { id: 'notification-system', label: 'تحديثات النظام' }
            ].map(item => (
              <div key={item.id} className="flex items-center">
                <input
                  id={item.id}
                  type="checkbox"
                  className="h-4 w-4 text-red-800 focus:ring-red-500 border-gray-300 rounded"
                  defaultChecked
                />
                <label htmlFor={item.id} className="mr-2 block text-sm text-gray-700 dark:text-gray-300">
                  {item.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </Section>
      
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSaveSettings}
          className="px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-700 flex items-center"
        >
          <Save size={18} className="ml-2" />
          حفظ الإعدادات
        </button>
      </div>
    </div>
  ), [emailNotifications, smsNotifications, systemNotifications, handleSaveSettings]);
  
  // Render active tab content
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'interface':
        return interfaceSettingsTab;
      case 'profile':
        return profileSettingsTab;
      case 'security':
        return securitySettingsTab;
      case 'embassies':
        return embassySettingsTab;
      case 'system':
        return systemSettingsTab;
      case 'notifications':
        return notificationSettingsTab;
      default:
        return interfaceSettingsTab;
    }
  };
  
  return (
    <div className="font-sans text-sm p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">إعدادات النظام</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">إدارة إعدادات النظام والتفضيلات الشخصية</p>
        </div>
        
        <SettingsTabs active={activeTab} setActive={setActiveTab} />
        
        {renderActiveTab()}
      </motion.div>
    </div>
  );
};

export default SettingsComponent;