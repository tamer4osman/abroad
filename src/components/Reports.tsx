import React, { useState, useCallback, useMemo } from 'react';
import { BarChart2, FileText, Download, Filter, RefreshCw, Printer, Search, ChevronDown, ChevronUp, Users, FileCheck, Clock, MapPin, Hash, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types and Interfaces ---
type ReportType = 'citizen' | 'passport' | 'visa' | 'attestation' | 'proxy' | 'activity' | 'performance';
type ReportPeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
type ProxyType = 'court' | 'bank' | 'divorce' | 'real-estate' | 'inheritance' | 'document-completion' | 'general';

interface ReportData {
  id: string;
  title: string;
  description: string;
  type: ReportType;
  lastUpdated: string;
  downloadFormats: string[];
  permitLevel: number; // 1: Public, 2: Embassy Staff, 3: Admin
}

interface FilterOption {
  id: string;
  label: string;
}

interface FilterState {
  type: ReportType | 'all';
  period: ReportPeriod;
  proxyType?: ProxyType | 'all';
  embassy?: string;
  startDate?: string;
  endDate?: string;
}

interface DashboardStat {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

interface ServiceMetric {
  name: string;
  completed: number;
  pending: number;
  color: string;
}

// --- Mock Data Functions ---
const generateMockReports = (): ReportData[] => {
  const today = new Date().toLocaleDateString('ar-LY');
  
  return [
    {
      id: 'rep-001',
      title: 'تقرير حالة خدمات المواطنين',
      description: 'إحصائيات شاملة عن جميع الخدمات المقدمة للمواطنين بالخارج',
      type: 'citizen',
      lastUpdated: today,
      downloadFormats: ['PDF', 'Excel'],
      permitLevel: 2
    },
    {
      id: 'rep-002',
      title: 'تقرير إصدار الجوازات',
      description: 'إحصائيات عن جوازات السفر الصادرة والمجددة والملغاة',
      type: 'passport',
      lastUpdated: today,
      downloadFormats: ['PDF', 'Excel', 'CSV'],
      permitLevel: 2
    },
    {
      id: 'rep-003',
      title: 'تقرير طلبات التأشيرات',
      description: 'إحصائيات عن التأشيرات الصادرة والمرفوضة حسب نوع التأشيرة والجنسية',
      type: 'visa',
      lastUpdated: today,
      downloadFormats: ['PDF', 'Excel'],
      permitLevel: 2
    },
    {
      id: 'rep-004',
      title: 'تقرير التوكيلات القانونية',
      description: 'تفاصيل عن التوكيلات الصادرة بأنواعها المختلفة',
      type: 'proxy',
      lastUpdated: today,
      downloadFormats: ['PDF', 'Excel'],
      permitLevel: 2
    },
    {
      id: 'rep-005',
      title: 'تقرير التصديقات',
      description: 'إحصائيات عن التصديقات المحلية والدولية',
      type: 'attestation',
      lastUpdated: today,
      downloadFormats: ['PDF', 'Excel'],
      permitLevel: 2
    },
    {
      id: 'rep-006',
      title: 'تقرير نشاط المستخدمين',
      description: 'سجل نشاط المستخدمين وعمليات تسجيل الدخول',
      type: 'activity',
      lastUpdated: today,
      downloadFormats: ['PDF', 'Excel'],
      permitLevel: 3
    },
    {
      id: 'rep-007',
      title: 'تقرير أداء الموظفين',
      description: 'قياس أداء الموظفين وإنتاجيتهم وسرعة معالجة الطلبات',
      type: 'performance',
      lastUpdated: today,
      downloadFormats: ['PDF', 'Excel'],
      permitLevel: 3
    },
    {
      id: 'rep-008',
      title: 'تقرير توكيلات المحاكم',
      description: 'تفاصيل تحليلية عن توكيلات المحاكم والتمثيل القانوني',
      type: 'proxy',
      lastUpdated: today,
      downloadFormats: ['PDF'],
      permitLevel: 2
    },
    {
      id: 'rep-009',
      title: 'تقرير التوكيلات المصرفية',
      description: 'تحليل للتوكيلات المصرفية وعمليات التفويض المالي',
      type: 'proxy',
      lastUpdated: today,
      downloadFormats: ['PDF', 'Excel'],
      permitLevel: 2
    },
    {
      id: 'rep-010',
      title: 'تقرير التوكيلات العقارية',
      description: 'تفاصيل عن توكيلات إدارة وبيع وشراء العقارات',
      type: 'proxy',
      lastUpdated: today,
      downloadFormats: ['PDF'],
      permitLevel: 2
    },
    {
      id: 'rep-011',
      title: 'ملخص الخدمات القنصلية',
      description: 'ملخص شامل عن جميع الخدمات القنصلية المقدمة',
      type: 'citizen',
      lastUpdated: today,
      downloadFormats: ['PDF', 'Excel'],
      permitLevel: 1
    },
    {
      id: 'rep-012',
      title: 'تقرير التوكيلات المنتهية',
      description: 'قائمة بالتوكيلات التي انتهت صلاحيتها أو تم إلغاؤها',
      type: 'proxy',
      lastUpdated: today,
      downloadFormats: ['PDF'],
      permitLevel: 2
    },
  ];
};

const generateMockStats = (): DashboardStat[] => {
  return [
    {
      title: 'إجمالي المواطنين المسجلين',
      value: '24,876',
      icon: <Users size={20} />,
      change: '+5.8%',
      trend: 'up'
    },
    {
      title: 'الطلبات المعالجة هذا الشهر',
      value: '1,250',
      icon: <FileCheck size={20} />,
      change: '+12.3%',
      trend: 'up'
    },
    {
      title: 'متوسط وقت معالجة الطلبات',
      value: '2.3 يوم',
      icon: <Clock size={20} />,
      change: '-8.5%',
      trend: 'down'
    },
    {
      title: 'التوكيلات النشطة',
      value: '3,142',
      icon: <FileText size={20} />,
      change: '+3.7%',
      trend: 'up'
    }
  ];
};

const generateServiceMetrics = (): ServiceMetric[] => {
  return [
    { name: 'جوازات السفر', completed: 432, pending: 98, color: 'bg-blue-500' },
    { name: 'التأشيرات', completed: 285, pending: 156, color: 'bg-green-500' },
    { name: 'التوكيلات', completed: 376, pending: 87, color: 'bg-yellow-500' },
    { name: 'التصديقات', completed: 528, pending: 73, color: 'bg-purple-500' },
    { name: 'السجل المدني', completed: 194, pending: 45, color: 'bg-pink-500' },
  ];
};

const generateEmbassyOptions = (): FilterOption[] => {
  return [
    { id: 'all', label: 'جميع السفارات' },
    { id: 'london', label: 'لندن - بريطانيا' },
    { id: 'paris', label: 'باريس - فرنسا' },
    { id: 'rome', label: 'روما - إيطاليا' },
    { id: 'berlin', label: 'برلين - ألمانيا' },
    { id: 'cairo', label: 'القاهرة - مصر' },
    { id: 'tunis', label: 'تونس - تونس' },
    { id: 'istanbul', label: 'إسطنبول - تركيا' },
    { id: 'dc', label: 'واشنطن - الولايات المتحدة' },
    { id: 'ottawa', label: 'أوتاوا - كندا' },
    { id: 'moscow', label: 'موسكو - روسيا' },
    { id: 'beijing', label: 'بكين - الصين' },
    { id: 'amman', label: 'عمان - الأردن' },
    { id: 'riyadh', label: 'الرياض - السعودية' },
    { id: 'dubai', label: 'دبي - الإمارات' },
  ];
};

// --- Reusable UI Components ---
interface SectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, icon, children }) => (
  <div className="border p-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md shadow-md mb-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {icon && <span className="text-red-800 dark:text-red-400">{icon}</span>}
    </div>
    <div>{children}</div>
  </div>
);

interface StatCardProps {
  stat: DashboardStat;
}

const StatCard: React.FC<StatCardProps> = ({ stat }) => {
  // Extract the nested ternary into a function that determines the trend color
  const getTrendColorClass = (trend?: 'up' | 'down' | 'neutral') => {
    if (trend === 'up') return 'text-green-500';
    if (trend === 'down') return 'text-red-500';
    return 'text-gray-500';
  };

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</h3>
          {stat.change && (
            <p className={`text-xs mt-1 ${getTrendColorClass(stat.trend)}`}>
              {stat.change}
            </p>
          )}
        </div>
        <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400">
          {stat.icon}
        </div>
      </div>
    </motion.div>
  );
};

interface ReportCardProps {
  report: ReportData;
  onDownload: (report: ReportData, format: string) => void;
  onViewReport: (report: ReportData) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, onDownload, onViewReport }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getReportIconByType = (type: ReportType) => {
    switch (type) {
      case 'citizen': return <Users size={18} />;
      case 'passport': return <FileCheck size={18} />;
      case 'visa': return <FileText size={18} />;
      case 'attestation': return <Hash size={18} />;
      case 'proxy': return <Handshake size={18} />;
      case 'activity': return <Activity size={18} />;
      case 'performance': return <BarChart2 size={18} />;
      default: return <BarChart2 size={18} />;
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -3 }}
      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-100 dark:border-gray-700"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400">
          {getReportIconByType(report.type)}
        </div>
        <div className="relative">
          <button 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            onClick={() => setShowMenu(!showMenu)}
          >
            <MoreVertical size={18} />
          </button>
          {showMenu && (
            <div className="absolute left-0 top-full mt-1 w-36 bg-white dark:bg-gray-700 shadow-lg rounded-md z-10">
              <div className="py-1">
                {report.downloadFormats.map((format) => (
                  <button 
                    key={format}
                    className="block w-full text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDownload(report, format);
                      setShowMenu(false);
                    }}
                  >
                    تحميل بصيغة {format}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-white text-right mb-2">{report.title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-right mb-3">{report.description}</p>
      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <div className="flex space-x-1 space-x-reverse">
          {report.downloadFormats.map((format) => (
            <span 
              key={format}
              className="inline-block bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"
            >
              {format}
            </span>
          ))}
        </div>
        <span>آخر تحديث: {report.lastUpdated}</span>
      </div>
      <button 
        className="mt-3 w-full py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-800/40 text-red-800 dark:text-red-400 rounded-md text-sm font-medium transition-colors"
        onClick={() => onViewReport(report)}
      >
        عرض التقرير
      </button>
    </motion.div>
  );
};


// --- Custom Hook for Reports Logic ---
const useReports = () => {
  const [reports] = useState<ReportData[]>(generateMockReports());
  const [stats] = useState<DashboardStat[]>(generateMockStats());
  const [serviceMetrics] = useState<ServiceMetric[]>(generateServiceMetrics());
  const [embassyOptions] = useState<FilterOption[]>(generateEmbassyOptions());
  const [filters, setFilters] = useState<FilterState>({
    type: 'all',
    period: 'monthly',
    proxyType: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'dashboard' | 'reports' | 'analytics'>('dashboard');
  const [expandedFilters, setExpandedFilters] = useState(false);
  
  const filterReports = useCallback(() => {
    return reports.filter(report => {
      // Filter by search query
      if (searchQuery && !report.title.includes(searchQuery) && !report.description.includes(searchQuery)) {
        return false;
      }
      
      // Filter by type
      if (filters.type !== 'all' && report.type !== filters.type) {
        return false;
      }
      
      // Additional proxy type filtering
      if (filters.type === 'proxy' && filters.proxyType !== 'all') {
        const proxyTypeMap: Record<ProxyType, string[]> = {
          'court': ['توكيلات المحاكم', 'قانون'],
          'bank': ['توكيلات المصرفية', 'مصرف', 'بنك'],
          'divorce': ['توكيلات الطلاق', 'طلاق'],
          'real-estate': ['توكيلات العقارية', 'عقار'],
          'inheritance': ['توكيلات الفريضة', 'ميراث', 'فريضة'],
          'document-completion': ['توكيلات إتمام', 'مستندات'],
          'general': ['توكيلات عام', 'عامة']
        };
        
        const keywords = proxyTypeMap[filters.proxyType as ProxyType];
        const matchesKeyword = keywords.some(keyword => 
          report.title.includes(keyword) || report.description.includes(keyword)
        );
        
        if (!matchesKeyword) return false;
      }
      
      return true;
    });
  }, [reports, searchQuery, filters]);

  const handleFilterChange = useCallback(<T extends FilterState[keyof FilterState]>(key: keyof FilterState, value: T) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleDownloadReport = useCallback((report: ReportData, format: string) => {
    // In a real application, this would trigger an API call to download the report
    console.log(`Downloading ${report.title} in ${format} format`);
    alert(`سيتم تحميل التقرير "${report.title}" بصيغة ${format}`);
  }, []);

  const handleViewReport = useCallback((report: ReportData) => {
    // In a real application, this would navigate to a detailed report view
    console.log(`Viewing report: ${report.title}`);
    alert(`عرض تفاصيل التقرير: ${report.title}`);
  }, []);

  return {
    reports,
    filteredReports: filterReports(),
    stats,
    serviceMetrics,
    filters,
    embassyOptions,
    searchQuery,
    selectedTab,
    expandedFilters,
    setSelectedTab,
    setExpandedFilters,
    handleFilterChange,
    handleSearchChange,
    handleDownloadReport,
    handleViewReport
  };
};

// --- Main Reports Component ---
const Reports: React.FC = () => {
  const {
    filteredReports,
    stats,
    serviceMetrics,
    filters,
    embassyOptions,
    searchQuery,
    selectedTab,
    expandedFilters,
    setSelectedTab,
    setExpandedFilters,
    handleFilterChange,
    handleSearchChange,
    handleDownloadReport,
    handleViewReport
  } = useReports();

  // --- Memoized UI Components ---
  const dashboardContent = useMemo(() => (
    <>
      <Section title="نظرة عامة على النظام" icon={<BarChart2 />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => (
            <StatCard key={`stat-${stat.title}`} stat={stat} />
          ))}
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
          <h3 className="font-semibold text-right mb-4">حالة الخدمات (الشهر الحالي)</h3>
          <div className="space-y-4">
            {serviceMetrics.map((service) => (
              <div key={`service-${service.name}`} className="text-right">
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {service.completed + service.pending} طلب
                  </span>
                  <span className="text-sm font-medium">{service.name}</span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${service.color}`} 
                    style={{ width: `${(service.completed / (service.completed + service.pending)) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span>{service.pending} معلق</span>
                  <span>{service.completed} مكتمل</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>
      
      <Section title="التوكيلات حسب النوع" icon={<FileText />}>
        <div className="h-64 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-2">رسم بياني دائري للتوكيلات حسب نوعها</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">(سيتم عرض رسم بياني تفاعلي هنا)</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 mt-4">
          {[
            { id: 'proxy-court', label: 'توكيلات المحاكم', value: '24%', color: 'bg-blue-500' },
            { id: 'proxy-bank', label: 'توكيلات بنكية', value: '18%', color: 'bg-green-500' },
            { id: 'proxy-divorce', label: 'توكيلات طلاق', value: '8%', color: 'bg-yellow-500' },
            { id: 'proxy-realestate', label: 'توكيلات عقارية', value: '21%', color: 'bg-purple-500' },
            { id: 'proxy-inheritance', label: 'توكيلات ميراث', value: '12%', color: 'bg-pink-500' },
            { id: 'proxy-documents', label: 'إتمام مستندات', value: '9%', color: 'bg-indigo-500' },
            { id: 'proxy-general', label: 'توكيلات عامة', value: '8%', color: 'bg-orange-500' },
          ].map((item) => (
            <div key={item.id} className="text-center p-2 rounded">
              <div className={`w-3 h-3 ${item.color} rounded-full mx-auto mb-1`} />
              <div className="text-xs font-medium">{item.label}</div>
              <div className="text-sm font-bold">{item.value}</div>
            </div>
          ))}
        </div>
      </Section>
      
      <Section title="الخدمات حسب السفارات" icon={<MapPin />}>
        <div className="h-64 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-2">رسم بياني شريطي للخدمات حسب السفارات</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">(سيتم عرض رسم بياني تفاعلي هنا)</p>
          </div>
        </div>
      </Section>
    </>
  ), [stats, serviceMetrics]);

  const reportsFilters = useMemo(() => (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <button
          className="flex items-center text-red-800 dark:text-red-400 text-sm"
          onClick={() => setExpandedFilters(!expandedFilters)}
        >
          {expandedFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          <span className="mr-1">{expandedFilters ? 'تصغير الخيارات' : 'خيارات أكثر'}</span>
        </button>
        <div className="flex items-center space-x-2 space-x-reverse">
          <span className="text-gray-700 dark:text-gray-300">تصفية التقارير</span>
          <Filter size={18} className="text-red-800 dark:text-red-400" />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="w-full sm:w-auto">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-right">
            نوع التقرير
          </label>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-right"
          >
            <option value="all">جميع أنواع التقارير</option>
            <option value="citizen">تقارير المواطنين</option>
            <option value="passport">تقارير الجوازات</option>
            <option value="visa">تقارير التأشيرات</option>
            <option value="attestation">تقارير التصديقات</option>
            <option value="proxy">تقارير التوكيلات</option>
            <option value="activity">تقارير النشاط</option>
            <option value="performance">تقارير الأداء</option>
          </select>
        </div>
        
        <div className="w-full sm:w-auto">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-right">
            الفترة الزمنية
          </label>
          <select
            value={filters.period}
            onChange={(e) => handleFilterChange('period', e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-right"
          >
            <option value="daily">اليوم</option>
            <option value="weekly">الأسبوع الحالي</option>
            <option value="monthly">الشهر الحالي</option>
            <option value="quarterly">الربع الحالي</option>
            <option value="yearly">السنة الحالية</option>
            <option value="custom">فترة مخصصة</option>
          </select>
        </div>
        
        {filters.type === 'proxy' && (
          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-right">
              نوع التوكيل
            </label>
            <select
              value={filters.proxyType || 'all'}
              onChange={(e) => handleFilterChange('proxyType', e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-right"
            >
              <option value="all">جميع أنواع التوكيلات</option>
              <option value="court">توكيلات المحاكم</option>
              <option value="bank">توكيلات بنكية</option>
              <option value="divorce">توكيلات طلاق</option>
              <option value="real-estate">توكيلات عقارية</option>
              <option value="inheritance">توكيلات الميراث</option>
              <option value="document-completion">إتمام مستندات</option>
              <option value="general">توكيلات عامة</option>
            </select>
          </div>
        )}
        
        <div className="relative flex-grow">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-right">
            بحث في التقارير
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="ابحث عن تقرير..."
              className="w-full p-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-right"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {expandedFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-right">
                    السفارة / القنصلية
                  </label>
                  <select
                    value={filters.embassy || 'all'}
                    onChange={(e) => handleFilterChange('embassy', e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-right"
                  >
                    {embassyOptions.map((embassy) => (
                      <option key={embassy.id} value={embassy.id}>
                        {embassy.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                {filters.period === 'custom' && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-right">
                        من تاريخ
                      </label>
                      <input
                        type="date"
                        value={filters.startDate || ''}
                        onChange={(e) => handleFilterChange('startDate', e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-right">
                        إلى تاريخ
                      </label>
                      <input
                        type="date"
                        value={filters.endDate || ''}
                        onChange={(e) => handleFilterChange('endDate', e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end mt-4">
                <button className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                  <RefreshCw size={16} className="ml-2" />
                  إعادة ضبط
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  ), [filters, searchQuery, expandedFilters, embassyOptions, handleFilterChange, handleSearchChange, setExpandedFilters]);

  const reportsContent = useMemo(() => (
    <>
      {reportsFilters}
      
      <div className="mb-4 flex justify-between items-center">
        <div className="flex space-x-2 space-x-reverse">
          <button className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center">
            <Printer size={16} className="ml-1" />
            طباعة
          </button>
          <button className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center">
            <Download size={16} className="ml-1" />
            تصدير الكل
          </button>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          عدد التقارير: <span className="font-bold">{filteredReports.length}</span>
        </p>
      </div>
      
      {filteredReports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onDownload={handleDownloadReport}
              onViewReport={handleViewReport}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <FileText size={48} className="mx-auto text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">لا توجد تقارير</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">لم يتم العثور على تقارير تطابق معايير البحث</p>
        </div>
      )}
    </>
  ), [filteredReports, reportsFilters, handleDownloadReport, handleViewReport]);

  const analyticsContent = useMemo(() => (
    <>
      <Section title="تحليلات التوكيلات" icon={<BarChart2 />}>
        <div className="h-96 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-2">رسم بياني متقدم لتحليل التوكيلات</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">(سيتم عرض رسم بياني تفاعلي هنا)</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {[
            { id: 'proxy-total', title: 'إجمالي التوكيلات النشطة', value: '3,142' },
            { id: 'proxy-expired', title: 'التوكيلات المنتهية', value: '684' },
            { id: 'proxy-expiring', title: 'توكيلات تنتهي خلال 30 يوم', value: '278' },
            { id: 'proxy-avgduration', title: 'متوسط مدة التوكيل', value: '13 شهر' }
          ].map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.title}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
      
      <Section title="تفاصيل التوكيلات حسب النوع" icon={<FileText />}>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800">
            <thead>
              <tr>
                <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  عدد التوكيلات
                </th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  متوسط المدة (شهر)
                </th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  نوع التوكيل
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {[
                { id: 'proxy-court', type: 'توكيلات المحاكم', status: 'نشط', avgDuration: 18, count: 754 },
                { id: 'proxy-bank', type: 'توكيلات بنكية', status: 'نشط', avgDuration: 12, count: 565 },
                { id: 'proxy-realestate', type: 'توكيلات عقارية', status: 'نشط', avgDuration: 24, count: 659 },
                { id: 'proxy-inheritance', type: 'توكيلات الميراث', status: 'نشط', avgDuration: 8, count: 377 },
                { id: 'proxy-divorce', type: 'توكيلات الطلاق', status: 'نشط', avgDuration: 6, count: 251 },
                { id: 'proxy-docs', type: 'توكيلات إتمام مستندات', status: 'نشط', avgDuration: 3, count: 283 },
                { id: 'proxy-general', type: 'توكيلات عامة', status: 'نشط', avgDuration: 12, count: 253 },
              ].map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-white">
                    {item.count.toLocaleString('ar-LY')}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-white">
                    {item.avgDuration}
                  </td>
                  <td className="px-4 py-3 text-right text-sm">
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                    {item.type}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
      
      <Section title="تحليل أداء الخدمات" icon={<Activity />}>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/2">
            <h4 className="text-sm font-semibold text-right mb-2">متوسط وقت معالجة الطلب (بالأيام)</h4>
            <div className="h-64 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">(رسم بياني خطي)</p>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <h4 className="text-sm font-semibold text-right mb-2">نسبة الطلبات المكتملة حسب نوع الخدمة</h4>
            <div className="h-64 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">(رسم بياني عمودي)</p>
            </div>
          </div>
        </div>
      </Section>
    </>
  ), []);

  // --- Main Render ---
  return (
    <div className="font-sans text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100" dir="rtl">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">التقارير والإحصائيات</h1>
          <div className="flex items-center space-x-2 space-x-reverse">
            <button 
              className="px-3 py-1 flex items-center text-sm bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-800/40 text-red-800 dark:text-red-400 rounded-md transition-colors"
              onClick={() => window.print()}
            >
              <Printer size={16} className="ml-1" />
              طباعة
            </button>
            <button className="px-3 py-1 flex items-center text-sm bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-800/40 text-red-800 dark:text-red-400 rounded-md transition-colors">
              <RefreshCw size={16} className="ml-1" />
              تحديث
            </button>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          عرض وتحليل البيانات والإحصائيات المتعلقة بخدمات السفارة والقنصليات
        </p>
      </div>
      
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          className={`px-4 py-2 ${
            selectedTab === 'dashboard' 
              ? 'text-red-800 dark:text-red-400 border-b-2 border-red-800 dark:border-red-400 font-medium' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          onClick={() => setSelectedTab('dashboard')}
        >
          لوحة المعلومات
        </button>
        <button
          className={`px-4 py-2 ${
            selectedTab === 'reports' 
              ? 'text-red-800 dark:text-red-400 border-b-2 border-red-800 dark:border-red-400 font-medium' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          onClick={() => setSelectedTab('reports')}
        >
          التقارير
        </button>
        <button
          className={`px-4 py-2 ${
            selectedTab === 'analytics' 
              ? 'text-red-800 dark:text-red-400 border-b-2 border-red-800 dark:border-red-400 font-medium' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          onClick={() => setSelectedTab('analytics')}
        >
          التحليلات المتقدمة
        </button>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {selectedTab === 'dashboard' && dashboardContent}
          {selectedTab === 'reports' && reportsContent}
          {selectedTab === 'analytics' && analyticsContent}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Reports;

// Helper component
const MoreVertical = ({ size = 24 }: { size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0  0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
);

const Handshake = ({ size = 24 }: { size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M9 11l3 3L22 4" />
    <path d="M21 13V4h-9" />
    <path d="M3 21l9-9" />
    <path d="M13 21H3v-9" />
  </svg>
);

