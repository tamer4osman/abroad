import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { FileText, Search, ChevronDown, ChevronUp, Download, Eye, Check, AlertCircle, Clock } from 'lucide-react';

// Define interfaces for our component data
interface PassportApplication {
  application_id: number;
  applicant_name: string;
  application_type: 'standard' | 'travel_document' | 'child_addition';
  application_date: string;
  status: 'completed' | 'delivered' | 'printed';
  national_id: string; 
  passport_number?: string;
  issue_date?: string;
  expiry_date?: string;
  processing_officer?: string;
  embassy_name?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

// Status badge component for application status
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'completed':
        return { 
          bg: 'bg-green-100 dark:bg-green-900/30', 
          text: 'text-green-800 dark:text-green-400',
          icon: <Check size={15} className="mr-1" />,
          label: 'مكتمل'
        };
      case 'delivered':
        return { 
          bg: 'bg-blue-100 dark:bg-blue-900/30', 
          text: 'text-blue-800 dark:text-blue-400',
          icon: <Download size={15} className="mr-1" />,
          label: 'تم التسليم'
        };
      case 'printed':
        return { 
          bg: 'bg-purple-100 dark:bg-purple-900/30', 
          text: 'text-purple-800 dark:text-purple-400',
          icon: <FileText size={15} className="mr-1" />,
          label: 'تمت الطباعة'
        };
      default:
        return { 
          bg: 'bg-gray-100 dark:bg-gray-700', 
          text: 'text-gray-800 dark:text-gray-400',
          icon: <Clock size={15} className="mr-1" />,
          label: status 
        };
    }
  };

  const { bg, text, icon, label } = getStatusConfig();

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
      {icon} {label}
    </span>
  );
};

// Application type badge component
const TypeBadge: React.FC<{ type: string }> = ({ type }) => {
  const getTypeConfig = () => {
    switch (type) {
      case 'standard':
        return { 
          bg: 'bg-indigo-100 dark:bg-indigo-900/30', 
          text: 'text-indigo-800 dark:text-indigo-400',
          label: 'جواز سفر'
        };
      case 'travel_document':
        return { 
          bg: 'bg-amber-100 dark:bg-amber-900/30', 
          text: 'text-amber-800 dark:text-amber-400',
          label: 'وثيقة سفر'
        };
      case 'child_addition':
        return { 
          bg: 'bg-rose-100 dark:bg-rose-900/30', 
          text: 'text-rose-800 dark:text-rose-400',
          label: 'إضافة طفل'
        };
      default:
        return { 
          bg: 'bg-gray-100 dark:bg-gray-700', 
          text: 'text-gray-800 dark:text-gray-400',
          label: type 
        };
    }
  };

  const { bg, text, label } = getTypeConfig();

  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
      {label}
    </span>
  );
};

const CompletedRequestsPassports: React.FC = () => {
  const [applications, setApplications] = useState<PassportApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof PassportApplication,
    direction: 'ascending' | 'descending'
  }>({
    key: 'application_date',
    direction: 'descending'
  });
  // const [selectedApplication, setSelectedApplication] = useState<number | null>(null);
  const [expandedApplication, setExpandedApplication] = useState<number | null>(null);

  // Fetch completed passport applications
  useEffect(() => {
    const fetchCompletedRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`${API_BASE_URL}/passports/applications`, {
          params: { status: ['completed', 'delivered', 'printed'].join(',') }
        });
        
        setApplications(response.data);
      } catch (err) {
        console.error('Error fetching completed passport applications:', err);
        setError('حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى.');
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedRequests();
  }, []);

  // Sort applications based on current sort configuration
  const sortedApplications = useMemo(() => {
    const sortableItems = [...applications];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key] ?? '';
        const bValue = b[sortConfig.key] ?? '';
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [applications, sortConfig]);

  // Filter applications based on search term
  const filteredApplications = useMemo(() => {
    if (!searchTerm) return sortedApplications;
    
    return sortedApplications.filter(app => 
      app.applicant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.national_id.includes(searchTerm) ||
      (app.passport_number && app.passport_number.includes(searchTerm))
    );
  }, [sortedApplications, searchTerm]);

  // Request handler for sorting
  const requestSort = (key: keyof PassportApplication) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ar-LY', options);
  };

  // Toggle expanded view for an application
  const toggleExpand = (applicationId: number) => {
    if (expandedApplication === applicationId) {
      setExpandedApplication(null);
    } else {
      setExpandedApplication(applicationId);
    }
  };

  // View application details
  const viewApplicationDetails = (applicationId: number) => {
    // setSelectedApplication(applicationId);
    // In a real application, this might open a modal or navigate to a details page
    console.log(`View details for application ${applicationId}`);
  };

  // Download application document
  const downloadDocument = (applicationId: number) => {
    // In a real application, this would trigger a document download
    console.log(`Download document for application ${applicationId}`);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 p-4 rounded-md flex items-center justify-center">
        <AlertCircle className="mr-2" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="p-6" dir="rtl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-2">
          الطلبات المكتملة - الجوازات
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center">
          عرض وإدارة طلبات الجوازات المكتملة
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="بحث بالاسم أو الرقم الوطني..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" size={18} />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">إجمالي الطلبات:</span>
          <span className="font-bold text-red-800 dark:text-red-500">{filteredApplications.length}</span>
        </div>
      </div>

      {/* Applications Table */}
      {filteredApplications.length === 0 ? (
        <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow">
          <FileText size={40} className="mx-auto text-gray-400 dark:text-gray-600 mb-3" />
          <p className="text-gray-500 dark:text-gray-400">لا توجد طلبات مكتملة</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <button
                      className="flex items-center focus:outline-none"
                      onClick={() => requestSort('applicant_name')}
                    >
                      اسم المتقدم
                      {sortConfig.key === 'applicant_name' && (
                        sortConfig.direction === 'ascending' ? 
                          <ChevronUp size={15} className="mr-1" /> : 
                          <ChevronDown size={15} className="mr-1" />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <button
                      className="flex items-center focus:outline-none"
                      onClick={() => requestSort('application_type')}
                    >
                      نوع الطلب
                      {sortConfig.key === 'application_type' && (
                        sortConfig.direction === 'ascending' ? 
                          <ChevronUp size={15} className="mr-1" /> : 
                          <ChevronDown size={15} className="mr-1" />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <button
                      className="flex items-center focus:outline-none"
                      onClick={() => requestSort('application_date')}
                    >
                      تاريخ الطلب
                      {sortConfig.key === 'application_date' && (
                        sortConfig.direction === 'ascending' ? 
                          <ChevronUp size={15} className="mr-1" /> : 
                          <ChevronDown size={15} className="mr-1" />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <button
                      className="flex items-center focus:outline-none"
                      onClick={() => requestSort('status')}
                    >
                      الحالة
                      {sortConfig.key === 'status' && (
                        sortConfig.direction === 'ascending' ? 
                          <ChevronUp size={15} className="mr-1" /> : 
                          <ChevronDown size={15} className="mr-1" />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredApplications.map((application) => (
                  <React.Fragment key={application.application_id}>
                    <tr 
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                      onClick={() => toggleExpand(application.application_id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {application.applicant_name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {application.national_id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <TypeBadge type={application.application_type} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {formatDate(application.application_date)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={application.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <button 
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              viewApplicationDetails(application.application_id);
                            }}
                          >
                            <Eye size={17} />
                          </button>
                          <button 
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadDocument(application.application_id);
                            }}
                          >
                            <Download size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedApplication === application.application_id && (
                      <tr className="bg-gray-50 dark:bg-gray-700">
                        <td colSpan={5} className="px-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <div className="font-medium text-gray-700 dark:text-gray-300">معلومات الجواز</div>
                              <div className="mt-1">
                                <div><span className="text-gray-500 dark:text-gray-400">رقم الجواز:</span> {application.passport_number || 'غير متوفر'}</div>
                                <div><span className="text-gray-500 dark:text-gray-400">تاريخ الإصدار:</span> {application.issue_date ? formatDate(application.issue_date) : 'غير متوفر'}</div>
                                <div><span className="text-gray-500 dark:text-gray-400">تاريخ الانتهاء:</span> {application.expiry_date ? formatDate(application.expiry_date) : 'غير متوفر'}</div>
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-gray-700 dark:text-gray-300">معلومات المعالجة</div>
                              <div className="mt-1">
                                <div><span className="text-gray-500 dark:text-gray-400">ضابط المعالجة:</span> {application.processing_officer || 'غير متوفر'}</div>
                                <div><span className="text-gray-500 dark:text-gray-400">السفارة/القنصلية:</span> {application.embassy_name || 'غير متوفر'}</div>
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-gray-700 dark:text-gray-300">الإجراءات المتاحة</div>
                              <div className="mt-1 space-y-2">
                                <button className="text-sm bg-red-700 hover:bg-red-800 text-white py-1 px-3 rounded-md transition-colors">
                                  طباعة إيصال الاستلام
                                </button>
                                <button className="block text-sm bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-3 rounded-md transition-colors">
                                  عرض تفاصيل كاملة
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompletedRequestsPassports;