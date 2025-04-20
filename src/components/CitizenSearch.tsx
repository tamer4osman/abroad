import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  searchCitizens,
  CitizenSearchParams,
  CitizenSearchResults,
} from "../services/api";
import {
  User,
  Search,
  FileText,
  ChevronDown,
  ChevronUp,
  Filter,
  Calendar,
  Download,
  Eye,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Citizen {
  id?: string;
  citizen_id?: number;
  nationalId: string;
  firstName: string;
  lastName: string;
  fatherNameAr?: string;
  fatherNameEn?: string;
  motherNameAr?: string;
  motherNameEn?: string;
  gender: string;
  birthDate?: string;
  date_of_birth?: string; // Legacy field for backward compatibility
  birthPlace?: string;
  place_of_birth?: string; // Legacy field for backward compatibility
  maritalStatus: string;
  occupation?: string;
  nationality?: string;
  isAlive?: boolean;
  is_alive?: boolean; // Legacy field for backward compatibility
  registrationDate?: string;
  registration_date?: string; // Legacy field for backward compatibility
  passports?: Passport[];
  family_relationships?: FamilyRelationship[];
  contactInfo?: ContactInfo[];
  
  // Add snake_case alternatives that may come from the API
  first_name_ar?: string;
  last_name_ar?: string;
  father_name_ar?: string;
  mother_name_ar?: string;
  first_name_en?: string;
  last_name_en?: string;
  mother_name_en?: string;
}

// Define which keys of Citizen are sortable and comparable
type SortableCitizenKey = keyof Pick<
  Citizen,
  "firstName" | "nationalId" | "date_of_birth" | "gender"
>;

interface Passport {
  passport_number: string;
  issue_date: string;
  expiry_date: string;
}

interface FamilyRelationship {
  related_citizen_id: number;
  relationship_type: string; // e.g., 'SPOUSE', 'CHILD', 'PARENT'
  // Add other relevant fields if available from the API
}

interface ContactInfo {
  type: string; // e.g., 'PHONE', 'EMAIL', 'ADDRESS'
  value: string;
  // Add other relevant fields if available from the API
}

// Constants for dropdown options
const GENDER_OPTIONS = [
  { value: "", label: "الجميع" },
  { value: "M", label: "ذكر" },
  { value: "F", label: "أنثى" },
];

const MARITAL_STATUS_OPTIONS = [
  { value: "", label: "الجميع" },
  { value: "SINGLE", label: "أعزب" },
  { value: "MARRIED", label: "متزوج" },
  { value: "DIVORCED", label: "مطلق" },
  { value: "WIDOWED", label: "أرمل" },
];

const RELATIONSHIP_OPTIONS = [
  { value: "", label: "الجميع" },
  { value: "SPOUSE", label: "زوج/زوجة" },
  { value: "CHILD", label: "ابن/ابنة" },
  { value: "PARENT", label: "أب/أم" },
  { value: "SIBLING", label: "أخ/أخت" },
  { value: "OTHER", label: "أخرى" },
];

const ALIVE_STATUS_OPTIONS = [
  { value: "", label: "الجميع" },
  { value: "true", label: "على قيد الحياة" },
  { value: "false", label: "متوفي" },
];

// Helper components
interface InputFieldProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  icon,
  className = "",
}) => (
  <div className={`${className}`}>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-right"
    >
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-right"
        placeholder={placeholder}
      />
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
    </div>
  </div>
);

interface SelectFieldProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  id,
  name,
  value,
  onChange,
  options,
  placeholder,
  className = "",
}) => (
  <div className={`${className}`}>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-right"
    >
      {label}
    </label>
    <select
      id={id}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md 
              bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-right"
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const CitizenSearch: React.FC = () => {
  // State for search parameters
  const [searchParams, setSearchParams] = useState<CitizenSearchParams>({
    page: 1,
    pageSize: 10,
  });

  // UI state
  const [searchResults, setSearchResults] =
    useState<CitizenSearchResults | null>(null);
  const [expandedCitizen, setExpandedCitizen] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedFilters, setExpandedFilters] = useState<boolean>(false);
  const [sortConfig, setSortConfig] = useState<{
    key: SortableCitizenKey | null;
    direction: "ascending" | "descending";
  }>({
    key: null,
    direction: "ascending",
  });

  // Helper function to format dates
  const formatDate = useCallback((dateString: string) => {
    if (!dateString) return "غير محدد";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ar-SA");
    } catch {
      return dateString;
    }
  }, []);

  // Handle input change for search parameters
  const handleParamChange = useCallback(
    (name: string, value: string | boolean) => {
      setSearchParams((prev) => ({ ...prev, [name]: value, page: 1 })); // Reset to page 1 when changing filters
    },
    []
  );

  // Handle search execution
  const executeSearch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Convert strings to proper types
      const params = {
        ...searchParams,
        isAlive:
          searchParams.isAlive === "true"
            ? true
            : searchParams.isAlive === "false"
            ? false
            : undefined,
      };

      const results = await searchCitizens(params);
      setSearchResults(results);
    } catch (err) {
      console.error("Search error:", err);
      setError("حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  // Execute search when parameters change (with debounce for typing)
  useEffect(() => {
    const handler = setTimeout(() => {
      executeSearch();
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [executeSearch]);

  // Handle page change
  const handlePageChange = useCallback((newPage: number) => {
    setSearchParams((prev) => ({ ...prev, page: newPage }));
  }, []);

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setSearchParams({
      page: 1,
      pageSize: 10,
      nameAr: undefined,
      nameEn: undefined,
      nationalId: undefined,
      passportNumber: undefined,
      birthDateFrom: undefined,
      birthDateTo: undefined,
      registrationDateFrom: undefined,
      registrationDateTo: undefined,
      gender: undefined,
      maritalStatus: undefined,
      isAlive: undefined,
      familyMemberId: undefined,
      relationship: undefined,
    });
    setExpandedFilters(false); // Optionally close advanced filters
    setSortConfig({ key: null, direction: "ascending" }); // Reset sorting
  }, []);

  // Handle sorting request
  const requestSort = useCallback(
    (key: SortableCitizenKey) => {
      let direction: "ascending" | "descending" = "ascending";
      if (sortConfig.key === key && sortConfig.direction === "ascending") {
        direction = "descending";
      }
      setSortConfig({ key, direction });
    },
    [sortConfig]
  );

  // Handle viewing citizen details
  const viewCitizenDetails = useCallback((id: number) => {
    console.log(`View details for citizen ${id}`);
    // Implement actual navigation or modal display logic here
    // Example: window.location.href = `/citizens/${id}`;
  }, []);

  // Toggle expanded view for a citizen
  const toggleExpandCitizen = useCallback((citizenId: number) => {
    setExpandedCitizen((prev) => (prev === citizenId ? null : citizenId));
  }, []);

  // Memoized sorted data
  const sortedCitizens = useMemo(() => {
    const data = searchResults?.data;
    if (!data || !sortConfig.key) return data;

    const sortableItems = [...data];
    const key = sortConfig.key; // Type is now SortableCitizenKey

    sortableItems.sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];

      // Handle potential null/undefined values
      if (aValue === null || aValue === undefined)
        return sortConfig.direction === "ascending" ? -1 : 1;
      if (bValue === null || bValue === undefined)
        return sortConfig.direction === "ascending" ? 1 : -1;

      // Specific comparison for date strings
      if (key === "date_of_birth") {
        const dateA = new Date(aValue as string).getTime();
        const dateB = new Date(bValue as string).getTime();
        // Handle invalid dates (NaN)
        if (isNaN(dateA) && isNaN(dateB)) return 0;
        if (isNaN(dateA)) return sortConfig.direction === "ascending" ? -1 : 1;
        if (isNaN(dateB)) return sortConfig.direction === "ascending" ? 1 : -1;

        if (dateA < dateB) return sortConfig.direction === "ascending" ? -1 : 1;
        if (dateA > dateB) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      }

      // Default comparison for other sortable types (string, national_id is string, gender is string)
      const valA = String(aValue).toLowerCase(); // Ensure case-insensitive string comparison
      const valB = String(bValue).toLowerCase();

      if (valA < valB) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (valA > valB) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

    return sortableItems;
  }, [searchResults?.data, sortConfig]); // Ensure dependency array is accurate

  // Render search filters
  const searchFilters = useMemo(
    () => (
      <div className="mb-6">
        <div className="flex flex-wrap justify-between items-center mb-4">
          {/* Quick search */}
          <div className="w-full md:w-auto mb-4 md:mb-0">
            <div className="relative">
              <input
                type="text"
                placeholder="بحث سريع (الاسم، الرقم الوطني)..."
                value={searchParams.nameAr || ""}
                onChange={(e) => handleParamChange("nameAr", e.target.value)}
                className="pl-10 pr-4 py-2 w-full md:w-64 border rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700"
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={18}
              />
            </div>
          </div>

          {/* Filter toggle button */}
          <button
            onClick={() => setExpandedFilters(!expandedFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <Filter size={16} className="ml-1" />
            خيارات البحث المتقدمة
            {expandedFilters ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
        </div>

        {/* Advanced filters */}
        <AnimatePresence>
          {expandedFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-inner border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Name search (Arabic) */}
                  <InputField
                    label="الاسم (عربي)"
                    id="nameAr"
                    name="nameAr"
                    value={searchParams.nameAr || ""}
                    onChange={(value) => handleParamChange("nameAr", value)}
                    icon={<User size={18} />}
                    placeholder="البحث بالاسم العربي"
                  />

                  {/* Name search (English) */}
                  <InputField
                    label="الاسم (إنجليزي)"
                    id="nameEn"
                    name="nameEn"
                    value={searchParams.nameEn || ""}
                    onChange={(value) => handleParamChange("nameEn", value)}
                    icon={<User size={18} />}
                    placeholder="البحث بالاسم الإنجليزي"
                  />

                  {/* National ID */}
                  <InputField
                    label="الرقم الوطني"
                    id="nationalId"
                    name="nationalId"
                    value={searchParams.nationalId || ""}
                    onChange={(value) => handleParamChange("nationalId", value)}
                    icon={<FileText size={18} />}
                    placeholder="البحث برقم الهوية"
                  />

                  {/* Passport number */}
                  <InputField
                    label="رقم جواز السفر"
                    id="passportNumber"
                    name="passportNumber"
                    value={searchParams.passportNumber || ""}
                    onChange={(value) =>
                      handleParamChange("passportNumber", value)
                    }
                    icon={<FileText size={18} />}
                    placeholder="البحث برقم جواز السفر"
                  />

                  {/* Birth date range */}
                  <div className="grid grid-cols-2 gap-2">
                    <InputField
                      label="تاريخ الميلاد (من)"
                      id="birthDateFrom"
                      name="birthDateFrom"
                      value={searchParams.birthDateFrom || ""}
                      onChange={(value) =>
                        handleParamChange("birthDateFrom", value)
                      }
                      type="date"
                      icon={<Calendar size={18} />}
                    />
                    <InputField
                      label="تاريخ الميلاد (إلى)"
                      id="birthDateTo"
                      name="birthDateTo"
                      value={searchParams.birthDateTo || ""}
                      onChange={(value) =>
                        handleParamChange("birthDateTo", value)
                      }
                      type="date"
                      icon={<Calendar size={18} />}
                    />
                  </div>

                  {/* Registration date range */}
                  <div className="grid grid-cols-2 gap-2">
                    <InputField
                      label="تاريخ التسجيل (من)"
                      id="registrationDateFrom"
                      name="registrationDateFrom"
                      value={searchParams.registrationDateFrom || ""}
                      onChange={(value) =>
                        handleParamChange("registrationDateFrom", value)
                      }
                      type="date"
                      icon={<Calendar size={18} />}
                    />
                    <InputField
                      label="تاريخ التسجيل (إلى)"
                      id="registrationDateTo"
                      name="registrationDateTo"
                      value={searchParams.registrationDateTo || ""}
                      onChange={(value) =>
                        handleParamChange("registrationDateTo", value)
                      }
                      type="date"
                      icon={<Calendar size={18} />}
                    />
                  </div>

                  {/* Gender */}
                  <SelectField
                    label="الجنس"
                    id="gender"
                    name="gender"
                    value={searchParams.gender || ""}
                    onChange={(value) => handleParamChange("gender", value)}
                    options={GENDER_OPTIONS}
                  />

                  {/* Marital status */}
                  <SelectField
                    label="الحالة الاجتماعية"
                    id="maritalStatus"
                    name="maritalStatus"
                    value={searchParams.maritalStatus || ""}
                    onChange={(value) =>
                      handleParamChange("maritalStatus", value)
                    }
                    options={MARITAL_STATUS_OPTIONS}
                  />

                  {/* Alive status */}
                  <SelectField
                    label="حالة الحياة"
                    id="isAlive"
                    name="isAlive"
                    value={searchParams.isAlive?.toString() || ""}
                    onChange={(value) =>
                      handleParamChange("isAlive", value || "")
                    }
                    options={ALIVE_STATUS_OPTIONS}
                  />

                  {/* Family relationship search */}
                  <div className="grid grid-cols-2 gap-2">
                    <InputField
                      label="معرف فرد العائلة"
                      id="familyMemberId"
                      name="familyMemberId"
                      value={searchParams.familyMemberId || ""}
                      onChange={(value) =>
                        handleParamChange("familyMemberId", value)
                      }
                      placeholder="رقم المعرف"
                    />
                    <SelectField
                      label="نوع العلاقة"
                      id="relationship"
                      name="relationship"
                      value={searchParams.relationship || ""}
                      onChange={(value) =>
                        handleParamChange("relationship", value)
                      }
                      options={RELATIONSHIP_OPTIONS}
                    />
                  </div>
                </div>

                {/* Reset filters button */}
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleClearFilters}
                    className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    <RefreshCw size={16} className="ml-2" />
                    إعادة ضبط
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    ),
    [expandedFilters, searchParams, handleParamChange, handleClearFilters]
  );

  // Render search results
  const resultContent = useMemo(() => {
    if (loading) {
      return (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-700 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">جاري البحث...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-10 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-lg">
          <p className="text-lg font-semibold">{error}</p>
          <button
            onClick={executeSearch}
            className="mt-4 px-4 py-2 bg-red-700 text-white rounded-md"
          >
            إعادة المحاولة
          </button>
        </div>
      );
    }

    if (!searchResults || searchResults.data.length === 0) {
      return (
        <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow">
          <FileText
            size={40}
            className="mx-auto text-gray-400 dark:text-gray-600 mb-3"
          />
          <p className="text-gray-500 dark:text-gray-400">
            لا توجد نتائج مطابقة
          </p>
        </div>
      );
    }

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  <button
                    className="flex items-center focus:outline-none"
                    onClick={() => requestSort("firstName")}
                  >
                    الاسم
                    {sortConfig.key === "firstName" &&
                      (sortConfig.direction === "ascending" ? (
                        <ChevronUp size={15} className="mr-1" />
                      ) : (
                        <ChevronDown size={15} className="mr-1" />
                      ))}
                  </button>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  <button
                    className="flex items-center focus:outline-none"
                    onClick={() => requestSort("nationalId")}
                  >
                    الرقم الوطني
                    {sortConfig.key === "nationalId" &&
                      (sortConfig.direction === "ascending" ? (
                        <ChevronUp size={15} className="mr-1" />
                      ) : (
                        <ChevronDown size={15} className="mr-1" />
                      ))}
                  </button>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  <button
                    className="flex items-center focus:outline-none"
                    onClick={() => requestSort("date_of_birth")}
                  >
                    تاريخ الميلاد
                    {sortConfig.key === "date_of_birth" &&
                      (sortConfig.direction === "ascending" ? (
                        <ChevronUp size={15} className="mr-1" />
                      ) : (
                        <ChevronDown size={15} className="mr-1" />
                      ))}
                  </button>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  <button
                    className="flex items-center focus:outline-none"
                    onClick={() => requestSort("gender")}
                  >
                    الجنس
                    {sortConfig.key === "gender" &&
                      (sortConfig.direction === "ascending" ? (
                        <ChevronUp size={15} className="mr-1" />
                      ) : (
                        <ChevronDown size={15} className="mr-1" />
                      ))}
                  </button>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {(sortedCitizens || searchResults.data).map((citizen) => (
                <React.Fragment key={citizen.nationalId}>
                  <tr
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    onClick={() => {
                      // Only try to expand if we have a valid ID to work with
                      if (citizen.nationalId || citizen.citizen_id) {
                        // Try to use citizen_id first, then nationalId as backup
                        const idToUse =
                          citizen.citizen_id || Number(citizen.nationalId);
                        // Make sure we're working with a valid number
                        if (typeof idToUse === "number" && !isNaN(idToUse)) {
                          toggleExpandCitizen(idToUse);
                        }
                      }
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {`${citizen.first_name_ar || citizen.firstName || ''} ${citizen.father_name_ar || citizen.fatherNameAr || ''} ${citizen.last_name_ar || citizen.lastName || ''}`}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {`${citizen.first_name_en || citizen.firstName || ''} ${citizen.father_name_en || ''} ${citizen.last_name_en || citizen.lastName || ''}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {citizen.nationalId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {formatDate(citizen.date_of_birth || "")}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {citizen.place_of_birth}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {citizen.gender === "M" ? "ذكر" : "أنثى"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <button
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Make sure to convert the ID to a number and check it's not NaN
                            if (citizen.nationalId) {
                              const idNum = Number(citizen.nationalId);
                              if (!isNaN(idNum)) {
                                viewCitizenDetails(idNum);
                              }
                            }
                          }}
                        >
                          <Eye size={17} />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Add print or export functionality with proper type handling
                            if (citizen.nationalId) {
                              const idNum = Number(citizen.nationalId);
                              if (!isNaN(idNum)) {
                                console.log(`Export citizen ${idNum}`);
                                // Implement export functionality here
                              }
                            }
                          }}
                        >
                          <Download size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded view */}
                  {expandedCitizen === Number(citizen.nationalId) && (
                    <tr className="bg-gray-50 dark:bg-gray-700">
                      <td colSpan={5} className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          {/* Personal Information */}
                          <div>
                            <div className="font-medium text-gray-700 dark:text-gray-300">
                              المعلومات الشخصية
                            </div>
                            <div className="mt-1">
                              <div>
                                <span className="text-gray-500 dark:text-gray-400">
                                  الاسم الكامل:
                                </span>{" "}
                                {`${citizen.firstName} ${
                                  citizen.fatherNameAr ||
                                  citizen.father_name_ar ||
                                  ""
                                } ${citizen.lastName}`}
                              </div>
                              <div>
                                <span className="text-gray-500 dark:text-gray-400">
                                  الاسم بالإنجليزي:
                                </span>{" "}
                                {`${citizen.firstName} ${
                                  citizen.fatherNameEn ||
                                  citizen.father_name_en ||
                                  ""
                                } ${citizen.lastName}`}
                              </div>
                              <div>
                                <span className="text-gray-500 dark:text-gray-400">
                                  الرقم الوطني:
                                </span>{" "}
                                {citizen.nationalId}
                              </div>
                              <div>
                                <span className="text-gray-500 dark:text-gray-400">
                                  تاريخ الميلاد:
                                </span>{" "}
                                {formatDate(citizen.date_of_birth || "")}
                              </div>
                              <div>
                                <span className="text-gray-500 dark:text-gray-400">
                                  مكان الميلاد:
                                </span>{" "}
                                {citizen.place_of_birth}
                              </div>
                              <div>
                                <span className="text-gray-500 dark:text-gray-400">
                                  الجنس:
                                </span>{" "}
                                {citizen.gender === "M" ? "ذكر" : "أنثى"}
                              </div>
                              <div>
                                <span className="text-gray-500 dark:text-gray-400">
                                  الجنسية:
                                </span>{" "}
                                {citizen.nationalId}
                              </div>
                              <div>
                                <span className="text-gray-500 dark:text-gray-400">
                                  الحالة الاجتماعية:
                                </span>{" "}
                                {citizen.maritalStatus === "SINGLE"
                                  ? "أعزب"
                                  : citizen.maritalStatus === "MARRIED"
                                  ? "متزوج"
                                  : citizen.maritalStatus === "DIVORCED"
                                  ? "مطلق"
                                  : citizen.maritalStatus === "WIDOWED"
                                  ? "أرمل"
                                  : citizen.maritalStatus}
                              </div>
                              <div>
                                <span className="text-gray-500 dark:text-gray-400">
                                  المهنة:
                                </span>{" "}
                                {citizen.occupation || "غير محدد"}
                              </div>
                            </div>
                          </div>

                          {/* Passport Information */}
                          <div>
                            <div className="font-medium text-gray-700 dark:text-gray-300">
                              معلومات جواز السفر
                            </div>
                            <div className="mt-1">
                              {citizen.passports &&
                              citizen.passports.length > 0 ? (
                                citizen.passports.map(
                                  (passport: Passport, idx: number) => (
                                    <div key={idx} className="mb-2">
                                      <div>
                                        <span className="text-gray-500 dark:text-gray-400">
                                          رقم الجواز:
                                        </span>{" "}
                                        {passport.passport_number}
                                      </div>
                                      <div>
                                        <span className="text-gray-500 dark:text-gray-400">
                                          تاريخ الإصدار:
                                        </span>{" "}
                                        {formatDate(passport.issue_date)}
                                      </div>
                                      <div>
                                        <span className="text-gray-500 dark:text-gray-400">
                                          تاريخ الانتهاء:
                                        </span>{" "}
                                        {formatDate(passport.expiry_date)}
                                      </div>
                                    </div>
                                  )
                                )
                              ) : (
                                <div className="text-gray-500 dark:text-gray-400">
                                  لا توجد معلومات جواز سفر
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Contact Information */}
                          <div>
                            <div className="font-medium text-gray-700 dark:text-gray-300">
                              معلومات الاتصال
                            </div>
                            <div className="mt-1">
                              {citizen.contactInfo &&
                              citizen.contactInfo.length > 0 ? (
                                citizen.contactInfo.map(
                                  (contact: ContactInfo, idx: number) => (
                                    <div key={idx}>
                                      {contact.type === "PHONE" && (
                                        <div>
                                          <span className="text-gray-500 dark:text-gray-400">
                                            الهاتف:
                                          </span>{" "}
                                          {contact.value}
                                        </div>
                                      )}
                                      {contact.type === "EMAIL" && (
                                        <div>
                                          <span className="text-gray-500 dark:text-gray-400">
                                            البريد الإلكتروني:
                                          </span>{" "}
                                          {contact.value}
                                        </div>
                                      )}
                                      {contact.type === "ADDRESS" && (
                                        <div>
                                          <span className="text-gray-500 dark:text-gray-400">
                                            العنوان:
                                          </span>{" "}
                                          {contact.value}
                                        </div>
                                      )}
                                      {/* Add handling for other contact types if needed */}
                                    </div>
                                  )
                                )
                              ) : (
                                <div className="text-gray-500 dark:text-gray-400">
                                  لا توجد معلومات اتصال
                                </div>
                              )}
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

        {/* Pagination */}
        {searchResults &&
          searchResults.pagination &&
          searchResults.pagination.totalPages > 1 && (
            <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
              <div className="flex-1 flex justify-between items-center">
                <button
                  onClick={() =>
                    handlePageChange(searchResults.pagination.currentPage - 1)
                  }
                  disabled={!searchResults.pagination.hasPreviousPage}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 
                  ${
                    !searchResults.pagination.hasPreviousPage
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  السابق
                </button>

                <span className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">
                    {searchResults.pagination.currentPage}
                  </span>{" "}
                  /{" "}
                  <span className="font-medium">
                    {searchResults.pagination.totalPages}
                  </span>{" "}
                  صفحة (إجمالي: {searchResults.pagination.totalCount})
                </span>

                <button
                  onClick={() =>
                    handlePageChange(searchResults.pagination.currentPage + 1)
                  }
                  disabled={!searchResults.pagination.hasNextPage}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 
                ${
                  !searchResults.pagination.hasNextPage
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
                >
                  التالي
                </button>
              </div>
            </div>
          )}
      </div>
    );
  }, [
    loading,
    error,
    executeSearch,
    searchResults,
    sortedCitizens,
    expandedCitizen,
    toggleExpandCitizen,
    viewCitizenDetails,
    handlePageChange,
    formatDate,
    requestSort,
    sortConfig.direction,
    sortConfig.key,
  ]);

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-2">
          البحث المتقدم عن المواطنين
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center">
          استخدم الخيارات أدناه للبحث عن المواطنين في النظام
        </p>
      </div>

      {searchFilters}

      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            إجمالي النتائج:
          </span>
          <span className="font-bold text-red-800 dark:text-red-500">
            {searchResults?.pagination?.totalCount || 0}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {loading && (
            <span className="text-sm flex items-center gap-1">
              <div className="animate-spin h-4 w-4 rounded-full border-t-2 border-r-2 border-red-700"></div>
              <span>جاري التحميل...</span>
            </span>
          )}
        </div>
      </div>

      {resultContent}
    </div>
  );
};

export default CitizenSearch;
